package com.crm.hirebrix.teams;

import com.crm.hirebrix.assignments.ConsultantAssignment;
import com.crm.hirebrix.common.ApiResponse;
import com.crm.hirebrix.teams.dto.CreateTeamRequest;
import com.crm.hirebrix.teams.dto.ManagerDashboardResponse;
import com.crm.hirebrix.teams.dto.UpdateTeamRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager")
public class ManagerTeamController {

    private final ManagerTeamService managerTeamService;

    public ManagerTeamController(ManagerTeamService managerTeamService) {
        this.managerTeamService = managerTeamService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<ManagerDashboardResponse> getDashboard(@RequestParam String managerUserId) {
        return new ApiResponse<>(true, managerTeamService.getDashboard(managerUserId));
    }

    @PostMapping("/teams")
    public ApiResponse<Team> createTeam(
            @RequestParam String managerUserId,
            @RequestBody CreateTeamRequest request
    ) {
        return new ApiResponse<>(true, managerTeamService.createTeam(managerUserId, request));
    }

    @PostMapping("/teams/{teamId}/consultants/{consultantUserId}")
    public ApiResponse<ConsultantAssignment> assignConsultant(
            @RequestParam String managerUserId,
            @PathVariable String teamId,
            @PathVariable String consultantUserId
    ) {
        return new ApiResponse<>(true,
                managerTeamService.assignConsultant(managerUserId, teamId, consultantUserId));
    }

    @PostMapping("/teams/{teamId}/recruiters/{recruiterUserId}")
    public ApiResponse<Team> addRecruiter(
            @RequestParam String managerUserId,
            @PathVariable String teamId,
            @PathVariable String recruiterUserId
    ) {
        return new ApiResponse<>(true, managerTeamService.addRecruiter(managerUserId, teamId, recruiterUserId));
    }

    @PutMapping("/teams/{teamId}")
    public ApiResponse<Team> updateTeam(
            @RequestParam String managerUserId,
            @PathVariable String teamId,
            @RequestBody UpdateTeamRequest request
    ) {
        return new ApiResponse<>(true, managerTeamService.updateTeam(managerUserId, teamId, request));
    }
}