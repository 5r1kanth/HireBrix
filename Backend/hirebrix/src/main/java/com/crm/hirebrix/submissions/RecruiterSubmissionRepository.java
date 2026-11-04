package com.crm.hirebrix.submissions;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RecruiterSubmissionRepository extends MongoRepository<RecruiterSubmission, String> {

    List<RecruiterSubmission> findByCompanyIdAndRecruiterUserIdOrderByUpdatedAtDesc(
            String companyId,
            String recruiterUserId
    );

    List<RecruiterSubmission> findByCompanyIdAndRecruiterUserIdInOrderByUpdatedAtDesc(
            String companyId,
            List<String> recruiterUserIds
    );

    List<RecruiterSubmission> findByCompanyIdAndConsultantUserIdInOrderByUpdatedAtDesc(
            String companyId,
            List<String> consultantUserIds
    );

    Optional<RecruiterSubmission> findByIdAndCompanyId(String id, String companyId);

    Optional<RecruiterSubmission> findByIdAndCompanyIdAndRecruiterUserId(
            String id,
            String companyId,
            String recruiterUserId
    );
}