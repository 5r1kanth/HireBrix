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
        if (!companyRepository.findByName(company.getName()).isEmpty()){
            return null;
        }
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

    /* =========================
       Update company general info
    ========================== */
    public Company updateCompany(String id, Company updatedCompany) {
        Optional<Company> existingOpt = companyRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return null; // company not found
        }

        Company existing = existingOpt.get();
        if (updatedCompany.getName() != null) existing.setName(updatedCompany.getName());
        if (updatedCompany.getDomain() != null) existing.setDomain(updatedCompany.getDomain());
        if (updatedCompany.getStatus() != null) existing.setStatus(updatedCompany.getStatus());

        return companyRepository.save(existing);
    }
}
