package com.crm.hirebrix.users;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndCompanyIdAndIsDeletedFalse(String email, String companyId);

    // Active users, sorted by createdAt descending
    default List<User> findByCompanyIdAndIsDeletedFalseOrderByCreatedAtDesc(String companyId) {
        return findByCompanyIdAndIsDeletedFalse(companyId, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // Soft deleted users, sorted by createdAt descending
    default List<User> findByCompanyIdAndIsDeletedTrueOrderByCreatedAtDesc(String companyId) {
        return findByCompanyIdAndIsDeletedTrue(companyId, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // ---------------------------
    // New methods: sorted by updatedAt
    // ---------------------------

    // Active users sorted by updatedAt descending
    default List<User> findByCompanyIdAndIsDeletedFalseOrderByUpdatedAtDesc(String companyId) {
        return findByCompanyIdAndIsDeletedFalse(companyId, Sort.by(Sort.Direction.DESC, "updatedAt"));
    }

    // Deleted users sorted by updatedAt descending
    default List<User> findByCompanyIdAndIsDeletedTrueOrderByUpdatedAtDesc(String companyId) {
        return findByCompanyIdAndIsDeletedTrue(companyId, Sort.by(Sort.Direction.DESC, "updatedAt"));
    }

    List<User> findByCompanyIdAndRoleAndIsDeletedFalse(String companyId, String role);

    // Search in multiple fields safely under same company
    List<User> findByCompanyIdAndIsDeletedFalseAndFullNameContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndEmailContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndRoleContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndDepartmentContainingIgnoreCase(
            String companyId1, String fullName,
            String companyId2, String email,
            String companyId3, String role,
            String companyId4, String department
    );

    List<User> findByCompanyId(String companyId);

    // Methods that support Sort parameter
    List<User> findByCompanyIdAndIsDeletedFalse(String companyId, Sort sort);
    List<User> findByCompanyIdAndIsDeletedTrue(String companyId, Sort sort);

    List<User> findByIdIn(List<String> ids);


}
