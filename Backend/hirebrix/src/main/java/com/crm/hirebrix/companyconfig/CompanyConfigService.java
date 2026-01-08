package com.crm.hirebrix.companyconfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyConfigService {

    @Autowired
    private CompanyConfigRepository configRepository;

    public CompanyConfig getConfigForCompany(String companyId) {
        return configRepository.findByCompanyId(companyId)
                .orElseGet(() -> {
                    // Auto-create default config for newly created company
                    CompanyConfig defaultConfig = CompanyConfig.defaultForCompany(companyId);
                    return configRepository.save(defaultConfig);
                });
    }

    public CompanyConfig updateConfig(String companyId, CompanyConfig newConfig) {

        CompanyConfig existing = configRepository
                .findByCompanyId(companyId)
                .orElseThrow(() -> new RuntimeException("Config not found"));

        existing.setRoles(newConfig.getRoles());
        existing.setUserStatuses(newConfig.getUserStatuses());
        existing.setDepartments(newConfig.getDepartments());

        return configRepository.save(existing);
    }

    public boolean isValidRole(String companyId, String role) {
        return getConfigForCompany(companyId).getRoles().contains(role);
    }

    public boolean isValidStatus(String companyId, String status) {
        return getConfigForCompany(companyId).getUserStatuses().contains(status);
    }

    public boolean isValidDepartment(String companyId, String dept) {
        return getConfigForCompany(companyId).getDepartments().contains(dept);
    }


}

