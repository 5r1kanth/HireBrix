package com.crm.hirebrix.companyconfig;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CompanyConfigRepository extends MongoRepository<CompanyConfig, String> {
    Optional<CompanyConfig> findByCompanyId(String companyId);
}

