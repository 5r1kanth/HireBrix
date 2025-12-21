package com.crm.hirebrix.users;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    @Indexed
    private String companyId;

    @Indexed(unique = true)
    private String email;

    @Indexed
    private String role;

    private String status;
    private String googleId;

    private Instant createdAt;
}

