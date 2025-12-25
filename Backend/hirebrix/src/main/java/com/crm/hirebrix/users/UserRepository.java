package com.crm.hirebrix.users;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndCompanyIdAndIsDeletedFalse(String email, String companyId);

    List<User> findByCompanyIdAndIsDeletedFalse(String companyId);
    List<User> findByCompanyIdAndRoleAndIsDeletedFalse(String companyId, String role);

    // Soft deleted users
    List<User> findByCompanyIdAndIsDeletedTrue(String companyId);

    // Search in multiple fields safely under same company
    List<User> findByCompanyIdAndIsDeletedFalseAndFullNameContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndEmailContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndRoleContainingIgnoreCaseOrCompanyIdAndIsDeletedFalseAndDepartmentContainingIgnoreCase(
            String companyId1, String fullName,
            String companyId2, String email,
            String companyId3, String role,
            String companyId4, String department
    );

    List<User> findByCompanyId(String companyId);
}
