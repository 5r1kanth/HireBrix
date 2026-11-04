package com.crm.hirebrix.consultants;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "consultant_profiles")
@Data
public class ConsultantProfile {

    @Id
    private String id;

    @Indexed
    private String companyId;

    @Indexed(unique = true)
    private String userId;

    private List<String> skills = new ArrayList<>();
    private List<Experience> experience = new ArrayList<>();
    private List<String> certifications = new ArrayList<>();
    private String professionalTitle;
    private Integer yearsExperience;
    private String location;
    private String availability;
    private String summary;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @Data
    public static class Experience {
        private String title;
        private String company;
        private LocalDate startDate;
        private LocalDate endDate;
        private String description;
    }
}