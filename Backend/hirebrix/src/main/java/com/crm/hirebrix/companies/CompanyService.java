package com.crm.hirebrix.companies;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    /* =========================
       Create a new company
    ========================== */
    public Company createCompany(Company company) {
        company.setCreatedAt(Instant.now());
        return companyRepository.save(company);
    }

    /* =========================
       Get company by ID
    ========================== */
    public Company getCompanyById(String id) {
        Optional<Company> company = companyRepository.findById(id);
        return company.orElse(null);
    }
}
