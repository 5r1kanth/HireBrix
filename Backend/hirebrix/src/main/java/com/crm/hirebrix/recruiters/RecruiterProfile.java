package com.crm.hirebrix.recruiters;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "recruiter_profiles")
@Data
public class RecruiterProfile {

    @Id
    private String id;

    @Indexed
    private String companyId;

    @Indexed(unique = true)
    private String userId;

    private String managerUserId;
    private String teamLeadUserId;
    private Integer monthlySubmissionTarget;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}