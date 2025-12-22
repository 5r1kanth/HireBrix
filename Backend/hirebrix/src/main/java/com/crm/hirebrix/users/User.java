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
    private String role; // Admin, Manager, Team Lead, Recruiter, Consultant

    private String status; // Active / Inactive

    // Name fields
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullName; // optional, can be built from first + middle + last

    // OAuth fields
    @Indexed(unique = true, sparse = true)
    private String googleId; // only for Google OAuth users
    private String picture;  // profile picture URL from Google

    private String department;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}
