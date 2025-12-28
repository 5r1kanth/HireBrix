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
        newConfig.setCompanyId(companyId);
        return configRepository.save(newConfig);
    }
}

