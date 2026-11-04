package com.crm.hirebrix.assignments;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "consultant_assignments")
@CompoundIndexes({
        @CompoundIndex(
                name = "company_consultant_status_assigned_idx",
                def = "{'companyId': 1, 'consultantUserId': 1, 'status': 1, 'assignedAt': -1}"
        ),
        @CompoundIndex(
                name = "company_recruiter_status_assigned_idx",
                def = "{'companyId': 1, 'recruiterUserId': 1, 'status': 1, 'assignedAt': -1}"
        ),
        @CompoundIndex(
                name = "company_team_status_assigned_idx",
                def = "{'companyId': 1, 'teamId': 1, 'status': 1, 'assignedAt': -1}"
        )
})
@Data
public class ConsultantAssignment {

    @Id
    private String id;

    private String companyId;
    private String consultantUserId;
        private String teamId;
    private String recruiterUserId;
    private String assignedByUserId;
    private String status = "Active";
    private Instant assignedAt = Instant.now();
    private Instant endedAt;
}