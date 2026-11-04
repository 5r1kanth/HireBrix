package com.crm.hirebrix.recruiters.dto;

public record CreateSubmissionRequest(
        String consultantUserId,
        String jobTitle,
        String client,
        String vendor,
        String stage,
        String outcome,
        String notes
) {}