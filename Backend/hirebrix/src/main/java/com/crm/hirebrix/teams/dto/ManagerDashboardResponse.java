package com.crm.hirebrix.teams.dto;

import java.util.List;

public record ManagerDashboardResponse(
        List<ConsultantSummary> unassignedConsultants,
        List<ConsultantSummary> consultants,
        List<TeamMemberSummary> teamLeads,
        List<TeamMemberSummary> allTeamLeads,
        List<TeamMemberSummary> recruiters,
        List<TeamMemberSummary> allRecruiters,
        List<TeamSummary> teams
) {
    public record ConsultantSummary(String userId, String name, String email, String department) {}
    public record TeamMemberSummary(String userId, String name, String email) {}
    public record TeamSummary(
            String id,
            String name,
            String teamLeadUserId,
            String teamLeadName,
            List<String> recruiterUserIds,
            List<String> recruiterNames,
            List<ConsultantSummary> consultants
    ) {}
}