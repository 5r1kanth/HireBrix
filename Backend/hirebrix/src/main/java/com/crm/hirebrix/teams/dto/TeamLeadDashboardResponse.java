package com.crm.hirebrix.teams.dto;

import java.util.List;

public record TeamLeadDashboardResponse(
        String teamId,
        String teamName,
        List<TeamMember> recruiters,
        List<ManagerDashboardResponse.ConsultantSummary> consultants
) {
    public record TeamMember(String userId, String name, String email) {}
}