package com.crm.hirebrix.companyconfig;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "company_configs")
@Data
public class CompanyConfig {

    @Id
    private String id;

    private String companyId;

    private List<String> roles;
    private List<String> userStatuses;
    private List<String> departments; // ✅ ADD THIS

    public static CompanyConfig defaultForCompany(String companyId) {
        CompanyConfig config = new CompanyConfig();
        config.setCompanyId(companyId);

        config.setRoles(List.of(
                "Admin",
                "Manager",
                "Team Lead",
                "Recruiter",
                "HR Manager",
                "Consultant"
        ));

        config.setUserStatuses(List.of(
                "Active",
                "Inactive",
                "Invited",
                "Pending"
        ));

        config.setDepartments(List.of(
                "HR",
                "Engineering",
                "Sales",
                "Operations",
                "Hyderabad"
        ));

        return config;
    }
}
