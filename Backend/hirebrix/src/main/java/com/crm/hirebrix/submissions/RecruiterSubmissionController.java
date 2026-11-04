package com.crm.hirebrix.submissions;

import com.crm.hirebrix.common.ApiResponse;
import com.crm.hirebrix.recruiters.RecruiterDashboardService;
import com.crm.hirebrix.recruiters.dto.CreateSubmissionRequest;
import com.crm.hirebrix.recruiters.dto.RecruiterDashboardResponse;
import com.crm.hirebrix.recruiters.dto.UpdateSubmissionRequest;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/submissions")
public class RecruiterSubmissionController {

    private final RecruiterDashboardService recruiterDashboardService;

    public RecruiterSubmissionController(RecruiterDashboardService recruiterDashboardService) {
        this.recruiterDashboardService = recruiterDashboardService;
    }

    @PostMapping
    public ApiResponse<RecruiterDashboardResponse.Submission> createSubmission(
            @RequestParam String recruiterUserId,
            @RequestBody CreateSubmissionRequest request
    ) {
        return new ApiResponse<>(true, recruiterDashboardService.createSubmission(recruiterUserId, request));
    }

    @PatchMapping("/{submissionId}")
    public ApiResponse<RecruiterDashboardResponse.Submission> updateSubmission(
            @PathVariable String submissionId,
            @RequestParam String recruiterUserId,
            @RequestBody UpdateSubmissionRequest request
    ) {
        return new ApiResponse<>(true,
                recruiterDashboardService.updateSubmission(recruiterUserId, submissionId, request));
    }
}