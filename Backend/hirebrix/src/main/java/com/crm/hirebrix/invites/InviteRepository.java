package com.crm.hirebrix.invites;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface InviteRepository extends MongoRepository<Invite, String> {
    Optional<Invite> findByEmail(String email);
    Optional<Invite> findByTokenHash(String tokenHash); // Use this for optimized lookup

    List<Invite> findByExpiresAtBeforeAndStatus(Instant now, String status);

    Optional<Invite> findByEmailAndCompanyId(String lowerCase, String companyId);
}
