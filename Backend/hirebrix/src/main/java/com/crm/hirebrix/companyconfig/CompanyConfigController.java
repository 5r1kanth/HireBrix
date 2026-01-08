package com.crm.hirebrix.companyconfig;

import com.crm.hirebrix.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
public class CompanyConfigController {

    @Autowired
    private CompanyConfigService configService;

    @GetMapping("/{companyId}/config")
    public ApiResponse<CompanyConfig> getCompanyConfig(@PathVariable String companyId) {
        CompanyConfig companyConfig = configService.getConfigForCompany(companyId);
        return new ApiResponse<>(true, companyConfig);
    }

    @PutMapping("/{companyId}/config")
    public CompanyConfig updateConfig(
            @PathVariable String companyId,
            @RequestBody CompanyConfig config
    ) {
        return configService.updateConfig(companyId, config);
    }
}
