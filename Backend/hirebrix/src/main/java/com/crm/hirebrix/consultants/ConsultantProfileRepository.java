package com.crm.hirebrix.consultants;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultantProfileRepository extends MongoRepository<ConsultantProfile, String> {

    Optional<ConsultantProfile> findByUserId(String userId);

    List<ConsultantProfile> findByUserIdIn(List<String> userIds);

    List<ConsultantProfile> findByCompanyIdOrderByUpdatedAtDesc(String companyId);
}