package com.crm.hirebrix.recruiters;

import com.crm.hirebrix.assignments.ConsultantAssignment;
import com.crm.hirebrix.assignments.ConsultantAssignmentRepository;
import com.crm.hirebrix.consultants.ConsultantProfile;
import com.crm.hirebrix.consultants.ConsultantProfileRepository;
import com.crm.hirebrix.interviews.RecruiterInterview;
import com.crm.hirebrix.interviews.RecruiterInterviewRepository;
import com.crm.hirebrix.recruiters.dto.CreateSubmissionRequest;
import com.crm.hirebrix.recruiters.dto.RecruiterDashboardResponse;
import com.crm.hirebrix.recruiters.dto.UpdateSubmissionRequest;
import com.crm.hirebrix.submissions.RecruiterSubmission;
import com.crm.hirebrix.submissions.RecruiterSubmissionRepository;
import com.crm.hirebrix.teams.Team;
import com.crm.hirebrix.teams.TeamRepository;
import com.crm.hirebrix.users.User;
import com.crm.hirebrix.users.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class RecruiterDashboardService {

    private static final String ACTIVE = "Active";
    private static final Set<String> STAGES = Set.of("Submitted", "Screening", "Interview", "Offer", "Hired");
    private static final Set<String> OUTCOMES = Set.of("Pending", "Scheduled", "Cleared", "Rejected", "Withdrawn");

    private final ConsultantAssignmentRepository assignmentRepository;
    private final ConsultantProfileRepository consultantProfileRepository;
    private final RecruiterInterviewRepository interviewRepository;
    private final RecruiterSubmissionRepository submissionRepository;
        private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public RecruiterDashboardService(
            ConsultantAssignmentRepository assignmentRepository,
            ConsultantProfileRepository consultantProfileRepository,
            RecruiterInterviewRepository interviewRepository,
            RecruiterSubmissionRepository submissionRepository,
            TeamRepository teamRepository,
            UserRepository userRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.consultantProfileRepository = consultantProfileRepository;
        this.interviewRepository = interviewRepository;
        this.submissionRepository = submissionRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public RecruiterDashboardResponse getDashboard(String recruiterUserId) {
        User recruiter = requireRecruiterOrTeamLead(recruiterUserId);
        String companyId = recruiter.getCompanyId();

        List<Team> teams = new ArrayList<>(teamRepository.findByCompanyIdAndRecruiterUserIdsContainingAndStatus(
                companyId, recruiterUserId, ACTIVE
        ));
        if ("Team Lead".equalsIgnoreCase(recruiter.getRole())) {
            teams.addAll(teamRepository.findByCompanyIdAndTeamLeadUserIdAndStatus(companyId, recruiterUserId, ACTIVE));
        }
        List<String> teamIds = teams.stream().map(Team::getId).toList();
        List<ConsultantAssignment> assignments = new ArrayList<>(assignmentRepository
                .findByCompanyIdAndRecruiterUserIdAndStatusOrderByAssignedAtDesc(companyId, recruiterUserId, ACTIVE));
        if (!teamIds.isEmpty()) {
            assignments.addAll(assignmentRepository.findByCompanyIdAndTeamIdInAndStatusOrderByAssignedAtDesc(
                    companyId, teamIds, ACTIVE
            ));
        }
        assignments = deduplicateById(assignments, ConsultantAssignment::getId);

        List<String> visibleRecruiterIds = new ArrayList<>();
        if ("Team Lead".equalsIgnoreCase(recruiter.getRole())) {
            visibleRecruiterIds.addAll(teams.stream()
                    .flatMap(team -> team.getRecruiterUserIds() == null ? Stream.empty() : team.getRecruiterUserIds().stream())
                    .filter(Objects::nonNull)
                    .distinct()
                    .toList());
        }
        if (!visibleRecruiterIds.contains(recruiterUserId)) visibleRecruiterIds.add(recruiterUserId);

        List<String> assignedConsultantIds = assignments.stream()
                .map(ConsultantAssignment::getConsultantUserId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        List<RecruiterSubmission> submissions = new ArrayList<>();
        if (!visibleRecruiterIds.isEmpty()) {
            submissions.addAll(submissionRepository
                    .findByCompanyIdAndRecruiterUserIdInOrderByUpdatedAtDesc(companyId, visibleRecruiterIds));
        }
        if (!assignedConsultantIds.isEmpty()) {
            submissions.addAll(submissionRepository.findByCompanyIdAndConsultantUserIdInOrderByUpdatedAtDesc(
                    companyId, assignedConsultantIds
            ));
        }
        submissions = deduplicateById(submissions, RecruiterSubmission::getId);

        List<RecruiterInterview> interviews = new ArrayList<>(interviewRepository
                .findByCompanyIdAndRecruiterUserIdAndStatusAndStartsAtAfterOrderByStartsAtAsc(
                        companyId, recruiterUserId, "Scheduled", Instant.now()
                ));
        if (!assignedConsultantIds.isEmpty()) {
            interviews.addAll(interviewRepository
                    .findByCompanyIdAndConsultantUserIdInAndStatusAndStartsAtAfterOrderByStartsAtAsc(
                            companyId, assignedConsultantIds, "Scheduled", Instant.now()
                    ));
        }
        interviews = deduplicateById(interviews, RecruiterInterview::getId);

        List<String> consultantUserIds = new ArrayList<>();
        assignments.stream().map(ConsultantAssignment::getConsultantUserId).forEach(consultantUserIds::add);
        submissions.stream().map(RecruiterSubmission::getConsultantUserId).forEach(consultantUserIds::add);
        interviews.stream().map(RecruiterInterview::getConsultantUserId).forEach(consultantUserIds::add);
        consultantUserIds = consultantUserIds.stream().filter(Objects::nonNull).distinct().toList();

        Map<String, User> usersById = consultantUserIds.isEmpty()
                ? Map.of()
                : userRepository.findByIdIn(consultantUserIds).stream()
                        .filter(user -> Objects.equals(user.getCompanyId(), companyId) && !user.isDeleted())
                        .collect(Collectors.toMap(User::getId, Function.identity()));
        Map<String, ConsultantProfile> profilesByUserId = consultantUserIds.isEmpty()
                ? Map.of()
                : consultantProfileRepository.findByUserIdIn(consultantUserIds).stream()
                        .filter(profile -> Objects.equals(profile.getCompanyId(), companyId))
                        .collect(Collectors.toMap(ConsultantProfile::getUserId, Function.identity()));
        Map<String, RecruiterSubmission> submissionsById = submissions.stream()
                .collect(Collectors.toMap(RecruiterSubmission::getId, Function.identity()));

        List<RecruiterDashboardResponse.AssignedConsultant> assignedConsultants = assignments.stream()
                .map(ConsultantAssignment::getConsultantUserId)
                .distinct()
                .map(userId -> toAssignedConsultant(usersById.get(userId), profilesByUserId.get(userId)))
                .filter(Objects::nonNull)
                .toList();

        List<RecruiterDashboardResponse.Submission> submissionRows = submissions.stream()
                .map(submission -> toSubmission(submission, usersById.get(submission.getConsultantUserId())))
                .toList();

        List<RecruiterDashboardResponse.UpcomingInterview> upcomingInterviews = interviews.stream()
                .map(interview -> toUpcomingInterview(
                        interview,
                        usersById.get(interview.getConsultantUserId()),
                        submissionsById.get(interview.getSubmissionId())
                ))
                .toList();

        return new RecruiterDashboardResponse(assignedConsultants, submissionRows, upcomingInterviews);
    }

    public RecruiterDashboardResponse.Submission createSubmission(
            String recruiterUserId,
            CreateSubmissionRequest request
    ) {
        User recruiter = requireRecruiterOrTeamLead(recruiterUserId);
        requireText(request.consultantUserId(), "Consultant is required");
        requireText(request.jobTitle(), "Job title is required");
        requireText(request.client(), "Client is required");
        requireText(request.vendor(), "Vendor is required");

        findAccessibleAssignment(recruiter.getCompanyId(), recruiterUserId, request.consultantUserId());

        User consultant = requireConsultant(request.consultantUserId(), recruiter.getCompanyId());
        String stage = StringUtils.hasText(request.stage()) ? request.stage() : "Submitted";
        String outcome = StringUtils.hasText(request.outcome()) ? request.outcome() : "Pending";
        validateStageAndOutcome(stage, outcome);

        Instant now = Instant.now();
        RecruiterSubmission submission = new RecruiterSubmission();
        submission.setCompanyId(recruiter.getCompanyId());
        submission.setRecruiterUserId(recruiterUserId);
        submission.setConsultantUserId(consultant.getId());
        submission.setJobTitle(request.jobTitle().trim());
        submission.setClient(request.client().trim());
        submission.setVendor(request.vendor().trim());
        submission.setStage(stage);
        submission.setOutcome(outcome);
        submission.setNotes(request.notes());
        submission.setSubmittedAt(now);
        submission.setUpdatedAt(now);

        return toSubmission(submissionRepository.save(submission), consultant);
    }

    public RecruiterDashboardResponse.Submission updateSubmission(
            String recruiterUserId,
            String submissionId,
            UpdateSubmissionRequest request
    ) {
        User recruiter = requireRecruiterOrTeamLead(recruiterUserId);
        RecruiterSubmission submission = submissionRepository
                .findByIdAndCompanyId(submissionId, recruiter.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        if (!recruiterUserId.equals(submission.getRecruiterUserId())) {
            findAccessibleAssignment(recruiter.getCompanyId(), recruiterUserId, submission.getConsultantUserId());
        }

        if (StringUtils.hasText(request.stage())) submission.setStage(request.stage());
        if (StringUtils.hasText(request.outcome())) submission.setOutcome(request.outcome());
        if (request.notes() != null) submission.setNotes(request.notes());
        validateStageAndOutcome(submission.getStage(), submission.getOutcome());
        submission.setUpdatedAt(Instant.now());

        User consultant = userRepository.findById(submission.getConsultantUserId())
                .filter(user -> Objects.equals(user.getCompanyId(), recruiter.getCompanyId()) && !user.isDeleted())
                .orElse(null);
        return toSubmission(submissionRepository.save(submission), consultant);
    }

    private User requireRecruiterOrTeamLead(String userId) {
        return userRepository.findById(userId)
                .filter(user -> !user.isDeleted() && ("Recruiter".equalsIgnoreCase(user.getRole())
                        || "Team Lead".equalsIgnoreCase(user.getRole())))
                .orElseThrow(() -> new IllegalArgumentException("Recruiter or Team Lead not found"));
    }

    private User requireConsultant(String userId, String companyId) {
        return userRepository.findById(userId)
                .filter(user -> !user.isDeleted()
                        && Objects.equals(companyId, user.getCompanyId())
                        && "Consultant".equalsIgnoreCase(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Consultant not found"));
    }

    private ConsultantAssignment findAccessibleAssignment(String companyId, String recruiterUserId, String consultantUserId) {
        List<ConsultantAssignment> directAssignments = assignmentRepository
                .findByCompanyIdAndConsultantUserIdAndRecruiterUserIdAndStatusOrderByAssignedAtDesc(
                        companyId, consultantUserId, recruiterUserId, ACTIVE
                );
        if (!directAssignments.isEmpty()) return directAssignments.get(0);

        List<String> teamIds = new ArrayList<>(teamRepository
                .findByCompanyIdAndRecruiterUserIdsContainingAndStatus(companyId, recruiterUserId, ACTIVE)
                .stream()
                .map(Team::getId)
                .toList());
        teamIds.addAll(teamRepository
                .findByCompanyIdAndTeamLeadUserIdAndStatus(companyId, recruiterUserId, ACTIVE)
                .stream()
                .map(Team::getId)
                .toList());
        return assignmentRepository.findByCompanyIdAndTeamIdInAndStatusOrderByAssignedAtDesc(
                        companyId, teamIds, ACTIVE
                ).stream()
                .filter(assignment -> consultantUserId.equals(assignment.getConsultantUserId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Consultant is not assigned to your team"));
    }

    private <T> List<T> deduplicateById(List<T> values, Function<T, String> idFunction) {
        return values.stream().collect(Collectors.toMap(
                idFunction, Function.identity(), (existing, duplicate) -> existing
        )).values().stream().toList();
    }

    private RecruiterDashboardResponse.AssignedConsultant toAssignedConsultant(User user, ConsultantProfile profile) {
        if (user == null || !"Consultant".equalsIgnoreCase(user.getRole())) return null;
        return new RecruiterDashboardResponse.AssignedConsultant(
                user.getId(),
                userName(user),
                profile != null && StringUtils.hasText(profile.getProfessionalTitle())
                        ? profile.getProfessionalTitle()
                        : user.getRole(),
                profile == null ? null : profile.getYearsExperience(),
                profile == null || profile.getSkills() == null ? List.of() : profile.getSkills()
        );
    }

    private RecruiterDashboardResponse.Submission toSubmission(RecruiterSubmission submission, User consultant) {
        return new RecruiterDashboardResponse.Submission(
                                submission.getId(), submission.getRecruiterUserId(), submission.getConsultantUserId(), userName(consultant),
                submission.getJobTitle(), submission.getClient(), submission.getVendor(),
                submission.getStage(), submission.getOutcome(), submission.getNotes(), submission.getUpdatedAt()
        );
    }

    private RecruiterDashboardResponse.UpcomingInterview toUpcomingInterview(
            RecruiterInterview interview,
            User consultant,
            RecruiterSubmission submission
    ) {
        return new RecruiterDashboardResponse.UpcomingInterview(
                interview.getId(), interview.getSubmissionId(), interview.getStartsAt(), userName(consultant),
                submission == null ? "" : submission.getJobTitle(),
                submission == null ? "" : submission.getClient(),
                interview.getStage(), interview.getType()
        );
    }

    private String userName(User user) {
        if (user == null) return "Consultant";
        if (StringUtils.hasText(user.getFullName())) return user.getFullName();
        return String.join(" ", Stream.of(user.getFirstName(), user.getLastName())
                .filter(StringUtils::hasText)
                .toList());
    }

    private void requireText(String value, String message) {
        if (!StringUtils.hasText(value)) throw new IllegalArgumentException(message);
    }

    private void validateStageAndOutcome(String stage, String outcome) {
        if (!STAGES.contains(stage)) throw new IllegalArgumentException("Invalid submission stage");
        if (!OUTCOMES.contains(outcome)) throw new IllegalArgumentException("Invalid submission outcome");
    }
}