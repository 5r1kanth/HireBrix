package com.crm.hirebrix.interviews;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface RecruiterInterviewRepository extends MongoRepository<RecruiterInterview, String> {

    List<RecruiterInterview> findByCompanyIdAndRecruiterUserIdAndStatusAndStartsAtAfterOrderByStartsAtAsc(
            String companyId,
            String recruiterUserId,
            String status,
            Instant startsAt
    );

            List<RecruiterInterview> findByCompanyIdAndConsultantUserIdInAndStatusAndStartsAtAfterOrderByStartsAtAsc(
                String companyId,
                List<String> consultantUserIds,
                String status,
                Instant startsAt
            );
}