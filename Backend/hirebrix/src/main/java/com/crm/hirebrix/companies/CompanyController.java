package com.crm.hirebrix.companies;

import com.crm.hirebrix.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public ApiResponse<Company> create(@RequestBody Company company) {
        Company created = companyService.createCompany(company);
        return new ApiResponse<>(true, created);
    }
}
