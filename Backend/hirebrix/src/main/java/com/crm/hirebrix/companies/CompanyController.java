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

    /* =========================
       Create a new company
    ========================== */
    @PostMapping
    public ApiResponse<Company> create(@RequestBody Company company) {
        Company created = companyService.createCompany(company);
        return new ApiResponse<>(true, created);
    }

    /* =========================
       Get company by ID
    ========================== */
    @GetMapping("/{id}")
    public ApiResponse<Company> getCompanyById(@PathVariable String id) {
        Company company = companyService.getCompanyById(id);
        if (company != null) {
            return new ApiResponse<>(true, company);
        } else {
            return new ApiResponse<>(false, null);
        }
    }
}
