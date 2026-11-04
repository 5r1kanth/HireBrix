package com.crm.hirebrix.recruiters;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RecruiterProfileRepository extends MongoRepository<RecruiterProfile, String> {

    Optional<RecruiterProfile> findByUserId(String userId);

    List<RecruiterProfile> findByCompanyIdOrderByUpdatedAtDesc(String companyId);
}