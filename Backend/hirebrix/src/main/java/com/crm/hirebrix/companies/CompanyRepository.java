package com.crm.hirebrix.companies;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CompanyRepository extends MongoRepository<Company, String> {
    Optional<Company> findByDomain(String domain);

    Optional<Company> findByName(String name);
}
