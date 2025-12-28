package com.crm.hirebrix.companyconfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
public class CompanyConfigController {

    @Autowired
    private CompanyConfigService configService;

    @GetMapping("/{companyId}/config")
    public CompanyConfig getCompanyConfig(@PathVariable String companyId) {
        return configService.getConfigForCompany(companyId);
    }

    @PutMapping("/{companyId}/config")
    public CompanyConfig updateConfig(
            @PathVariable String companyId,
            @RequestBody CompanyConfig config
    ) {
        return configService.updateConfig(companyId, config);
    }
}
