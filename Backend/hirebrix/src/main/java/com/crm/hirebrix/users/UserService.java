package com.crm.hirebrix.users;

import com.crm.hirebrix.common.NameUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

        user.setFullName(
                String.join(" ",
                        user.getFirstName() != null ? user.getFirstName() : "",
                        user.getMiddleName() != null ? user.getMiddleName() : "",
                        user.getLastName() != null ? user.getLastName() : ""
                ).trim()
        );

        user.setStatus(StringUtils.hasText(user.getStatus()) ? user.getStatus() : "Active");
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setDeleted(false);
        user.setDeletedAt(null);

        return userRepository.save(user);
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

        existing.setFullName( (existing.getMiddleName() != null) ?
                String.join(" ",
                        existing.getFirstName() != null ? existing.getFirstName() : "",
                        existing.getMiddleName(),
                        existing.getLastName() != null ? existing.getLastName() : ""
                ).trim() : String.join(" ",
                        existing.getFirstName() != null ? existing.getFirstName() : "",
                        existing.getLastName() != null ? existing.getLastName() : ""
                ).trim()
        );

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
        user.setStatus("Active");
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
                .findByCompanyIdAndIsDeletedFalseAndFullNameContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndEmailContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndRoleContainingIgnoreCase(
                        companyId, keyword,
                        companyId, keyword,
                        companyId, keyword,
                        companyId, keyword
                );
    }
}
