package com.crm.hirebrix.assignments;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConsultantAssignmentRepository extends MongoRepository<ConsultantAssignment, String> {

    List<ConsultantAssignment> findByCompanyIdAndConsultantUserIdAndStatusOrderByAssignedAtDesc(
            String companyId,
            String consultantUserId,
            String status
    );

    List<ConsultantAssignment> findByCompanyIdAndRecruiterUserIdAndStatusOrderByAssignedAtDesc(
            String companyId,
            String recruiterUserId,
            String status
    );

    boolean existsByCompanyIdAndConsultantUserIdAndRecruiterUserIdAndStatus(
            String companyId,
            String consultantUserId,
            String recruiterUserId,
            String status
    );

    List<ConsultantAssignment> findByCompanyIdAndConsultantUserIdAndRecruiterUserIdAndStatusOrderByAssignedAtDesc(
            String companyId,
            String consultantUserId,
            String recruiterUserId,
            String status
    );

    List<ConsultantAssignment> findByCompanyIdAndTeamIdAndStatusOrderByAssignedAtDesc(
            String companyId,
            String teamId,
            String status
    );

    List<ConsultantAssignment> findByCompanyIdAndTeamIdInAndStatusOrderByAssignedAtDesc(
            String companyId,
            List<String> teamIds,
            String status
    );

    List<ConsultantAssignment> findByCompanyIdAndConsultantUserIdAndStatus(
            String companyId,
            String consultantUserId,
            String status
    );

        List<ConsultantAssignment> findByCompanyIdAndStatus(String companyId, String status);
}