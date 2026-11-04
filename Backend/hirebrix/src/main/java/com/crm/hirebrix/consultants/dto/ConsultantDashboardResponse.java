package com.crm.hirebrix.consultants.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record ConsultantDashboardResponse(
        String consultantName,
        String professionalTitle,
        Integer yearsExperience,
        List<String> skills,
        List<Experience> experience,
        List<Team> teams,
        List<Submission> submissions,
        List<UpcomingInterview> upcomingInterviews
) {
    public record Experience(
            String title,
            String company,
            LocalDate startDate,
            LocalDate endDate,
            String description
    ) {}

    public record Team(
            String teamId,
            String teamName,
            String teamLeadName,
            List<String> recruiterNames
    ) {}

    public record Submission(
            String id,
            String recruiterName,
            String jobTitle,
            String client,
            String vendor,
            String stage,
            String outcome,
            Instant lastUpdated
    ) {}

    public record UpcomingInterview(
            String id,
            Instant dateTime,
            String role,
            String client,
            String stage,
            String type
    ) {}
}