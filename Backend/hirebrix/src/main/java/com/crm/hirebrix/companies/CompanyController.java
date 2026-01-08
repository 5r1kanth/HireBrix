package com.crm.hirebrix.companies;

import com.crm.hirebrix.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    /* =========================
       Create a new company
    ========================== */
    @PostMapping
    public ApiResponse<Company> create(@RequestBody Company company) {
        Company created = companyService.createCompany(company);
        if (created == null)
            return new ApiResponse<>(false, null);
        return new ApiResponse<>(true, created);
    }

    /* =========================
       Get company by ID
    ========================== */
    @GetMapping("/{id}")
    public ApiResponse<Company> getCompanyById(@PathVariable String id) {
        Company company = companyService.getCompanyById(id);
        System.out.println("Testing"+company);
        if (company != null) {
            return new ApiResponse<>(true, company);
        } else {
            return new ApiResponse<>(false, null);
        }
    }

    /* =========================
       Update company general details
    ========================== */
    @PutMapping("/{id}")
    public ApiResponse<Company> updateCompany(
            @PathVariable String id,
            @RequestBody Company updatedCompany
    ) {
        Company company = companyService.updateCompany(id, updatedCompany);
        if (company != null) {
            return new ApiResponse<>(true, company);
        } else {
            return new ApiResponse<>(false, null);
        }
    }
}
