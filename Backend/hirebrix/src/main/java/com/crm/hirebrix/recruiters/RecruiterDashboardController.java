package com.crm.hirebrix.recruiters;

import com.crm.hirebrix.common.ApiResponse;
import com.crm.hirebrix.recruiters.dto.RecruiterDashboardResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterDashboardController {

    private final RecruiterDashboardService recruiterDashboardService;

    public RecruiterDashboardController(RecruiterDashboardService recruiterDashboardService) {
        this.recruiterDashboardService = recruiterDashboardService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<RecruiterDashboardResponse> getDashboard(@RequestParam String recruiterUserId) {
        return new ApiResponse<>(true, recruiterDashboardService.getDashboard(recruiterUserId));
    }
}