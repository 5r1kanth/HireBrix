package com.crm.hirebrix.users;

import com.crm.hirebrix.common.NameUtils;
import com.crm.hirebrix.email.EmailService;
import com.crm.hirebrix.invites.InviteService;
import com.crm.hirebrix.invites.UserInvite;
import com.crm.hirebrix.invites.UserInviteRepository;
import com.crm.hirebrix.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.time.temporal.ChronoUnit;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserInviteRepository inviteRepository;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       UserInviteRepository inviteRepository,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.inviteRepository = inviteRepository;
        this.jwtService = jwtService;
    }

    /* =========================
       CREATE USER
    ========================= */
    public User createUser(User user) {

        if (!StringUtils.hasText(user.getEmail()) || !StringUtils.hasText(user.getCompanyId())) {
            throw new IllegalArgumentException("Email and Company ID are required");
        }

        userRepository
                .findByEmailAndCompanyIdAndIsDeletedFalse(user.getEmail(), user.getCompanyId())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("User already exists");
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

    public User createUserAndSendInvite(User user) {

        // 1️⃣ Create the user (same as existing createUser)
        User newUser = createUser(user);

        // 2️⃣ Generate secure token
        String rawToken = InviteService.generateToken();
        String hashedToken = BCrypt.hashpw(rawToken, BCrypt.gensalt());

        // 3️⃣ Create UserInvite
        UserInvite invite = new UserInvite();
        invite.setCompanyId(user.getCompanyId());
        invite.setEmail(user.getEmail().toLowerCase());
        invite.setRole(user.getRole());
        invite.setDepartment(user.getDepartment());
        invite.setTokenHash(hashedToken);
        invite.setStatus("Pending");
        invite.setSentAt(Instant.now());
        invite.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS)); // 7-day expiry

        // 4️⃣ Save invite in DB
        inviteRepository.save(invite);

        // 5️⃣ Send invite email
        EmailService.sendInvite(user.getEmail(), rawToken); // implement EmailService separately

        return newUser;
    }

    public String formFullName(String firstName, String middleName, String lastName){
        return ((middleName != null) ?
                (((firstName != null) ? firstName : "") + " " + middleName + " " + (lastName != null ? lastName : "")) :
                ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")));
    }

    /* =========================
       FETCH ACTIVE USERS
    ========================= */
    public List<User> getUsersByCompany(String companyId) {
        return userRepository.findByCompanyId(companyId);
    }

    /* =========================
       UPDATE USER
    ========================= */
    public User updateUser(String id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        existing.setEmail(user.getEmail());
        existing.setFirstName(NameUtils.normalize(user.getFirstName()));
        existing.setMiddleName(NameUtils.normalize(user.getMiddleName()));
        existing.setLastName(NameUtils.normalize(user.getLastName()));
        existing.setRole(NameUtils.normalize(user.getRole()));
        existing.setStatus(user.getStatus());
        existing.setDepartment(user.getDepartment());

        existing.setFullName(formFullName(user.getFirstName(), user.getMiddleName(), user.getLastName()));

        existing.setUpdatedAt(Instant.now());

        return userRepository.save(existing);
    }

    /* =========================
       SOFT DELETE
    ========================= */
    public void softDeleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setDeleted(true);
        user.setDeletedAt(Instant.now());
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
       GET DELETED USERS
    ========================= */
    public List<User> getDeletedUsersByCompany(String companyId) {
        return userRepository.findByCompanyIdAndIsDeletedTrue(companyId);
    }

    public List<User> searchUsers(String companyId, String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return getUsersByCompany(companyId);
        }
        return userRepository
                .findByCompanyIdAndIsDeletedFalseAndFullNameContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndEmailContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndRoleContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndDepartmentContainingIgnoreCase(
                        companyId, keyword,
                        companyId, keyword,
                        companyId, keyword,
                        companyId, keyword
                );
    }

    public User registerOrUpdateFromInvite(Map<String, Object> userInfo, String inviteToken, String inviteEmail) {

        // 1️⃣ Check if invite exists and token matches
        Optional<UserInvite> inviteOpt = inviteRepository.findAll().stream()
                .filter(inv -> BCrypt.checkpw(inviteToken, inv.getTokenHash()))
                .findFirst();

        UserInvite invite = inviteOpt.get();

        if (inviteOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid or expired invite token");
        }

        if (invite.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Invite has expired");
        }

        if (!invite.getEmail().equalsIgnoreCase(inviteEmail)){
            throw new IllegalArgumentException("Invite Email/Token Mismatch");
        }
        // 2️⃣ Find existing user or create new
        User user = userRepository.findByEmail(inviteEmail.toLowerCase()).orElse(new User());

        // Split name into first/last for better profile management
        user.setFirstName(NameUtils.normalize((String) userInfo.get("given_name")));
        user.setLastName(NameUtils.normalize((String) userInfo.get("family_name")));
        user.setFullName(NameUtils.normalize((String) userInfo.get("name")));
        user.setStatus("Active");
        user.setUpdatedAt(Instant.now());
        user.setGoogleId((String) userInfo.get("sub"));
        user.setPicture((String) userInfo.get("picture"));
        user.setActivatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        user = userRepository.save(user);

        // 3️⃣ Update invite status
        invite.setStatus("Accepted");
        invite.setAcceptedAt(Instant.now());
        inviteRepository.save(invite);

        return user;
    }

    /**
     * Generate JWT token for authenticated user
     */
    public String generateJwtToken(User user) {
        return jwtService.generateToken(user.getId(), user.getEmail(), user.getCompanyId(), user.getRole());
    }

}
