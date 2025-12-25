package com.crm.hirebrix.invites;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserInviteRepository extends MongoRepository<UserInvite, String> {
    Optional<UserInvite> findByEmail(String email);
    Optional<UserInvite> findByTokenHash(String tokenHash); // Use this for optimized lookup
}
