package com.crm.hirebrix.users;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmailAndCompanyIdAndIsDeletedFalse(String email, String companyId);

    List<User> findByCompanyIdAndIsDeletedFalse(String companyId);

    List<User> findByCompanyIdAndRoleAndIsDeletedFalse(String companyId, String role);

    List<User> findByCompanyIdAndDeletedTrue(String companyId);

    List<User> findByCompanyIdAndIsDeletedTrue(String companyId);

    List<User> findByCompanyId(String companyId);
}
