package com.crm.hirebrix.users;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    // Find a user by email and companyId
    Optional<User> findByEmailAndCompanyId(String email, String companyId);

    // Find all users in a company
    List<User> findByCompanyId(String companyId);

    // Find all users in a company with a specific role
    List<User> findByCompanyIdAndRole(String companyId, String role);

    // Optional: Find by full name in a company
    List<User> findByCompanyIdAndFullNameContainingIgnoreCase(String companyId, String fullName);
}
