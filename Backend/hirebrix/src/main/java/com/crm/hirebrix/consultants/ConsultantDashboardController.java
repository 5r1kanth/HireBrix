package com.crm.hirebrix.consultants;

import com.crm.hirebrix.common.ApiResponse;
import com.crm.hirebrix.consultants.dto.ConsultantDashboardResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/consultant")
public class ConsultantDashboardController {

    private final ConsultantDashboardService consultantDashboardService;

    public ConsultantDashboardController(ConsultantDashboardService consultantDashboardService) {
        this.consultantDashboardService = consultantDashboardService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<ConsultantDashboardResponse> getDashboard(@RequestParam String consultantUserId) {
        return new ApiResponse<>(true, consultantDashboardService.getDashboard(consultantUserId));
    }
}