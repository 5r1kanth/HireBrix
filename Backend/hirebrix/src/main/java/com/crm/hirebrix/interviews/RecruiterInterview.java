package com.crm.hirebrix.interviews;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "interviews")
@CompoundIndex(
        name = "company_recruiter_starts_idx",
        def = "{'companyId': 1, 'recruiterUserId': 1, 'startsAt': 1}"
)
@Data
public class RecruiterInterview {

    @Id
    private String id;

    private String companyId;
    private String recruiterUserId;
    private String consultantUserId;
    private String submissionId;
    private Instant startsAt;
    private String stage;
    private String type;
    private String status = "Scheduled";
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}