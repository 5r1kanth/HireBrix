package com.crm.hirebrix.invites;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "invites")
@Data
public class Invite {

    @Id
    private String id;

    @Indexed
    private String companyId;

    @Indexed(unique = true)
    private String email;

    private String role;
    private String department;

    /**
     * Secure hashed token stored only in DB (not plain text)
     */
    private String tokenHash;

    /**
     * Track Invite lifecycle
     */
    private String status; // Pending | Accepted | Expired | Revoked

    @Indexed
    private Instant expiresAt; // TTL auto-delete

    private Instant sentAt = Instant.now();
    private Instant acceptedAt;
}
