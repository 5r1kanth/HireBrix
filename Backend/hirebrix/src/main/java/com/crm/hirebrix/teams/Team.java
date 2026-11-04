package com.crm.hirebrix.teams;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "teams")
@CompoundIndexes({
        @CompoundIndex(name = "company_manager_status_idx", def = "{'companyId': 1, 'managerUserId': 1, 'status': 1}"),
        @CompoundIndex(name = "company_teamlead_status_idx", def = "{'companyId': 1, 'teamLeadUserId': 1, 'status': 1}"),
        @CompoundIndex(name = "company_recruiters_status_idx", def = "{'companyId': 1, 'recruiterUserIds': 1, 'status': 1}")
})
@Data
public class Team {

    @Id
    private String id;

    private String companyId;
    private String name;
    private String managerUserId;
    private String teamLeadUserId;
    private List<String> recruiterUserIds = new ArrayList<>();
    private String status = "Active";
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}