package com.crm.hirebrix.submissions;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "submissions")
@CompoundIndexes({
        @CompoundIndex(
                name = "company_recruiter_updated_idx",
                def = "{'companyId': 1, 'recruiterUserId': 1, 'updatedAt': -1}"
        ),
        @CompoundIndex(
                name = "company_consultant_submitted_idx",
                def = "{'companyId': 1, 'consultantUserId': 1, 'submittedAt': -1}"
        )
})
@Data
public class RecruiterSubmission {

    @Id
    private String id;

    private String companyId;
    private String recruiterUserId;
    private String consultantUserId;
    private String jobTitle;
    private String client;
    private String vendor;
    private String stage = "Submitted";
    private String outcome = "Pending";
    private String notes;
    private Instant submittedAt = Instant.now();
    private Instant updatedAt = Instant.now();
}