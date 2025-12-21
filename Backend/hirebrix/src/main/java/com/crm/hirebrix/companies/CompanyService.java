package com.crm.hirebrix.companies;

import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company createCompany(Company company) {
        company.setCreatedAt(Instant.now());
        return companyRepository.save(company);
    }
}
