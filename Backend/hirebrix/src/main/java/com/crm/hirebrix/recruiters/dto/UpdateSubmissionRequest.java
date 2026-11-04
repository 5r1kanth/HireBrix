package com.crm.hirebrix.recruiters.dto;

public record UpdateSubmissionRequest(
        String stage,
        String outcome,
        String notes
) {}