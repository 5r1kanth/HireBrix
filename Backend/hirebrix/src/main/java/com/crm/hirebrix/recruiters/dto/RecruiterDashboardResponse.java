package com.crm.hirebrix.recruiters.dto;

import java.time.Instant;
import java.util.List;

public record RecruiterDashboardResponse(
        List<AssignedConsultant> assignedConsultants,
        List<Submission> submissions,
        List<UpcomingInterview> upcomingInterviews
) {
    public record AssignedConsultant(
            String userId,
            String name,
            String role,
            Integer experience,
            List<String> primarySkills
    ) {}

    public record Submission(
            String id,
            String recruiterUserId,
            String consultantUserId,
            String consultantName,
            String jobTitle,
            String client,
            String vendor,
            String stage,
            String outcome,
            String notes,
            Instant lastUpdated
    ) {}

    public record UpcomingInterview(
            String id,
            String submissionId,
            Instant dateTime,
            String candidate,
            String role,
            String client,
            String stage,
            String type
    ) {}
}