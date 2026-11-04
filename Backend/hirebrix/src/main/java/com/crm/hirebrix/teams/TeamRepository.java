package com.crm.hirebrix.teams;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends MongoRepository<Team, String> {

    List<Team> findByCompanyIdAndStatus(String companyId, String status);

        List<Team> findByIdInAndCompanyIdAndStatus(List<String> ids, String companyId, String status);

    List<Team> findByCompanyIdAndManagerUserIdAndStatusOrderByCreatedAtDesc(
            String companyId,
            String managerUserId,
            String status
    );

    List<Team> findByCompanyIdAndRecruiterUserIdsContainingAndStatus(
            String companyId,
            String recruiterUserId,
            String status
    );

    List<Team> findByCompanyIdAndTeamLeadUserIdAndStatus(
            String companyId,
            String teamLeadUserId,
            String status
    );

    Optional<Team> findByIdAndCompanyIdAndManagerUserIdAndStatus(
            String id,
            String companyId,
            String managerUserId,
            String status
    );
}