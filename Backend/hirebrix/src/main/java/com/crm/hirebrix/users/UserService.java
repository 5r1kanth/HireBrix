package com.crm.hirebrix.users;

import com.crm.hirebrix.common.NameUtils;
import com.crm.hirebrix.invites.Invite;
import com.crm.hirebrix.invites.InviteService;
import com.crm.hirebrix.invites.InviteRepository;
import com.crm.hirebrix.security.JwtService;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final InviteRepository inviteRepository;
    private final JwtService jwtService;
    private final InviteService inviteService;

    public UserService(UserRepository userRepository,
                       InviteRepository inviteRepository,
                       JwtService jwtService,
                       InviteService inviteService) {
        this.userRepository = userRepository;
        this.inviteRepository = inviteRepository;
        this.jwtService = jwtService;
        this.inviteService = inviteService;
    }

    /* =========================
       CREATE USER
    ========================= */
    public User createUser(User user) {
        if (!StringUtils.hasText(user.getEmail()) || !StringUtils.hasText(user.getCompanyId())) {
            throw new IllegalArgumentException("Email and Company ID are required");
        }

//        userRepository.findByEmailAndCompanyIdAndIsDeletedFalse(user.getEmail(), user.getCompanyId())
//                .ifPresent(u -> { throw new IllegalArgumentException("User already exists"); });

        userRepository.findByEmailAndCompanyIdAndIsDeletedFalse(user.getEmail(), user.getCompanyId())
                .ifPresent(existingUser -> {
                    if ("Active".equalsIgnoreCase(existingUser.getStatus())) {
                        throw new IllegalArgumentException("User already exists and is active");
                    }
                });

        user.setFirstName(NameUtils.normalize(user.getFirstName()));
        user.setMiddleName(NameUtils.normalize(user.getMiddleName()));
        user.setLastName(NameUtils.normalize(user.getLastName()));
        user.setRole(NameUtils.normalize(user.getRole()));
        user.setFullName(formFullName(user.getFirstName(), user.getMiddleName(), user.getLastName()));

        user.setStatus("Invited");
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setInvitedAt(Instant.now());
        user.setDeleted(false);
        user.setDeletedAt(null);

        return userRepository.save(user);
    }

    /* =========================
       CREATE USER AND SEND INVITE
    ========================= */
    public User createUserAndSendInvite(User user) {
        User newUser = createUser(user);
        inviteService.createAndSendInvite(
                newUser.getEmail(),
                newUser.getCompanyId(),
                newUser.getRole(),
                newUser.getDepartment()
        );
        return newUser;
    }

    /* =========================
       FORM FULL NAME
    ========================= */
    public String formFullName(String firstName, String middleName, String lastName){
        return ((middleName != null) ?
                (((firstName != null) ? firstName : "") + " " + middleName + " " + (lastName != null ? lastName : "")) :
                ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")));
    }

    /* =========================
       POPULATE USER FIELDS FROM MAP
    ========================= */
    private void populateUserFields(User user, Map<String, Object> userInfo) {
        user.setFirstName(NameUtils.normalize((String) userInfo.get("given_name")));
        user.setLastName(NameUtils.normalize((String) userInfo.get("family_name")));
        user.setFullName(NameUtils.normalize((String) userInfo.get("name")));
        user.setGoogleId((String) userInfo.get("sub"));
        user.setPicture((String) userInfo.get("picture"));
        user.setUpdatedAt(Instant.now());
    }

    /* =========================
       FETCH ACTIVE USERS SORTED BY UPDATED DATE DESC
    ========================= */
    public List<User> getUsersByCompany(String companyId) {
        return userRepository.findByCompanyIdAndIsDeletedFalse(companyId, Sort.by(Sort.Direction.DESC, "updatedAt"));
    }

    /* =========================
       UPDATE USER
    ========================= */
    public User updateUser(String id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean emailChanged = !existing.getEmail().equalsIgnoreCase(user.getEmail());

        existing.setFirstName(NameUtils.normalize(user.getFirstName()));
        existing.setMiddleName(NameUtils.normalize(user.getMiddleName()));
        existing.setLastName(NameUtils.normalize(user.getLastName()));
        existing.setRole(NameUtils.normalize(user.getRole()));
        existing.setStatus(user.getStatus());
        existing.setDepartment(user.getDepartment());
        existing.setFullName(formFullName(user.getFirstName(), user.getMiddleName(), user.getLastName()));
        existing.setUpdatedAt(Instant.now());

        if (emailChanged) {
            handleEmailChange(existing, user.getEmail());
        }

        return userRepository.save(existing);
    }

    /* =========================
       HANDLE EMAIL CHANGE
    ========================= */
    private void handleEmailChange(User user, String newEmail) {
        user.setEmail(newEmail);
        user.setStatus("Invited");
        user.setInvitedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        inviteService.createAndSendInvite(
                user.getEmail(),
                user.getCompanyId(),
                user.getRole(),
                user.getDepartment()
        );
    }

    /* =========================
       SOFT DELETE
    ========================= */
    public void softDeleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setDeleted(true);
        user.setDeletedAt(Instant.now());
        if (user.getStatus().equalsIgnoreCase("Active"))
            user.setStatus("Inactive");
        user.setUpdatedAt(Instant.now());

        userRepository.save(user);
    }

    /* =========================
       RESTORE DELETED USER
    ========================= */
    public void restoreUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setDeleted(false);
        user.setDeletedAt(null);
        user.setUpdatedAt(Instant.now());

        userRepository.save(user);
    }

    /* =========================
       GET DELETED USERS SORTED BY CREATED DATE DESC
    ========================= */
    public List<User> getDeletedUsersByCompany(String companyId) {
        return userRepository.findByCompanyIdAndIsDeletedTrue(companyId, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    /* =========================
       SEARCH USERS
    ========================= */
    public List<User> searchUsers(String companyId, String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return getUsersByCompany(companyId);
        }

        List<User> results = userRepository
                .findByCompanyIdAndIsDeletedFalseAndFullNameContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndEmailContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndRoleContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndDepartmentContainingIgnoreCase(
                        companyId, keyword,
                        companyId, keyword,
                        companyId, keyword,
                        companyId, keyword
                );

        results.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return results;
    }

    /* =========================
       REGISTER OR UPDATE FROM INVITE
    ========================= */
    public User registerOrUpdateFromInvite(Map<String, Object> userInfo, String inviteToken, String inviteEmail) {

        Invite invite = inviteService.validateInvite(inviteToken, inviteEmail);

        User user = userRepository.findByEmail(inviteEmail.toLowerCase()).orElse(new User());

        populateUserFields(user, userInfo);
        user.setStatus("Active");
        user.setActivatedAt(Instant.now());

        user = userRepository.save(user);

        inviteService.markInviteAccepted(invite);

        return user;
    }

    /* =========================
       GET USER BY ID
    ========================= */
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    /* =========================
       GENERATE JWT
    ========================= */
    public String generateJwtToken(User user) {
        return jwtService.generateToken(user.getId(), user.getEmail(), user.getCompanyId(), user.getRole());
    }
}
