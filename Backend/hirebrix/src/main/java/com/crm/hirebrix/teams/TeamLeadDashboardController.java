package com.crm.hirebrix.teams;

import com.crm.hirebrix.common.ApiResponse;
import com.crm.hirebrix.teams.dto.TeamLeadDashboardResponse;
import com.crm.hirebrix.teams.dto.ManagerDashboardResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teamlead")
public class TeamLeadDashboardController {

    private final ManagerTeamService managerTeamService;

    public TeamLeadDashboardController(ManagerTeamService managerTeamService) {
        this.managerTeamService = managerTeamService;
    }

    @GetMapping("/consultants")
    public ApiResponse<List<ManagerDashboardResponse.ConsultantSummary>> getConsultants(
            @RequestParam String teamLeadUserId
    ) {
        return new ApiResponse<>(true, managerTeamService.getTeamLeadConsultants(teamLeadUserId));
    }

    @GetMapping("/dashboard")
    public ApiResponse<TeamLeadDashboardResponse> getDashboard(
            @RequestParam String teamLeadUserId
    ) {
        return new ApiResponse<>(true, managerTeamService.getTeamLeadDashboard(teamLeadUserId));
    }
}