package com.crm.hirebrix.companies;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "companies")
@Data
public class Company {

    @Id
    private String id;

    @Indexed(unique = true)
    private String domain;

    private String name;
    private String status;
    private Instant createdAt;
}
