package com.crm.hirebrix.consultants;

import com.crm.hirebrix.assignments.ConsultantAssignment;
import com.crm.hirebrix.assignments.ConsultantAssignmentRepository;
import com.crm.hirebrix.consultants.dto.ConsultantDashboardResponse;
import com.crm.hirebrix.interviews.RecruiterInterview;
import com.crm.hirebrix.interviews.RecruiterInterviewRepository;
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
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ConsultantDashboardService {

    private static final String ACTIVE = "Active";

    private final ConsultantAssignmentRepository assignmentRepository;
    private final ConsultantProfileRepository profileRepository;
    private final RecruiterInterviewRepository interviewRepository;
    private final RecruiterSubmissionRepository submissionRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public ConsultantDashboardService(
            ConsultantAssignmentRepository assignmentRepository,
            ConsultantProfileRepository profileRepository,
            RecruiterInterviewRepository interviewRepository,
            RecruiterSubmissionRepository submissionRepository,
            TeamRepository teamRepository,
            UserRepository userRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.profileRepository = profileRepository;
        this.interviewRepository = interviewRepository;
        this.submissionRepository = submissionRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public ConsultantDashboardResponse getDashboard(String consultantUserId) {
        User consultant = userRepository.findById(consultantUserId)
                .filter(user -> !user.isDeleted()
                        && ACTIVE.equalsIgnoreCase(user.getStatus())
                        && "Consultant".equalsIgnoreCase(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Consultant not found"));

        String companyId = consultant.getCompanyId();
        ConsultantProfile profile = profileRepository.findByUserId(consultantUserId)
                .filter(value -> Objects.equals(companyId, value.getCompanyId()))
                .orElse(null);
        List<ConsultantAssignment> assignments = assignmentRepository
                .findByCompanyIdAndConsultantUserIdAndStatusOrderByAssignedAtDesc(companyId, consultantUserId, ACTIVE);
        List<String> teamIds = assignments.stream()
                .map(ConsultantAssignment::getTeamId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        List<Team> teams = teamIds.isEmpty()
                ? List.of()
                : teamRepository.findByIdInAndCompanyIdAndStatus(teamIds, companyId, ACTIVE);

        List<RecruiterSubmission> submissions = submissionRepository
                .findByCompanyIdAndConsultantUserIdInOrderByUpdatedAtDesc(companyId, List.of(consultantUserId));
        List<RecruiterInterview> interviews = interviewRepository
                .findByCompanyIdAndConsultantUserIdInAndStatusAndStartsAtAfterOrderByStartsAtAsc(
                        companyId, List.of(consultantUserId), "Scheduled", Instant.now()
                );

        List<String> relatedUserIds = new ArrayList<>();
        assignments.stream().map(ConsultantAssignment::getRecruiterUserId).forEach(relatedUserIds::add);
        teams.stream().map(Team::getTeamLeadUserId).forEach(relatedUserIds::add);
        teams.stream()
                .filter(team -> team.getRecruiterUserIds() != null)
                .flatMap(team -> team.getRecruiterUserIds().stream())
                .forEach(relatedUserIds::add);
        submissions.stream().map(RecruiterSubmission::getRecruiterUserId).forEach(relatedUserIds::add);
        relatedUserIds = relatedUserIds.stream().filter(StringUtils::hasText).distinct().toList();

        Map<String, User> usersById = relatedUserIds.isEmpty()
                ? Map.of()
                : userRepository.findByIdIn(relatedUserIds).stream()
                        .filter(user -> Objects.equals(companyId, user.getCompanyId()) && !user.isDeleted())
                        .collect(Collectors.toMap(User::getId, Function.identity(), (first, ignored) -> first));

        Map<String, RecruiterSubmission> submissionsById = submissions.stream()
                .collect(Collectors.toMap(RecruiterSubmission::getId, Function.identity(), (first, ignored) -> first));

        List<ConsultantDashboardResponse.Team> teamRows = teams.stream()
                .map(team -> new ConsultantDashboardResponse.Team(
                        team.getId(),
                        team.getName(),
                        userName(usersById.get(team.getTeamLeadUserId())),
                        team.getRecruiterUserIds() == null
                                ? List.of()
                                : team.getRecruiterUserIds().stream()
                                        .map(usersById::get)
                                        .filter(Objects::nonNull)
                                        .map(this::userName)
                                        .toList()
                ))
                .toList();

        List<ConsultantDashboardResponse.Submission> submissionRows = submissions.stream()
                .map(submission -> new ConsultantDashboardResponse.Submission(
                        submission.getId(),
                        userName(usersById.get(submission.getRecruiterUserId())),
                        submission.getJobTitle(),
                        submission.getClient(),
                        submission.getVendor(),
                        submission.getStage(),
                        submission.getOutcome(),
                        submission.getUpdatedAt()
                ))
                .toList();

        List<ConsultantDashboardResponse.UpcomingInterview> interviewRows = interviews.stream()
                .map(interview -> toUpcomingInterview(interview, submissionsById.get(interview.getSubmissionId())))
                .toList();

        return new ConsultantDashboardResponse(
                userName(consultant),
                profile != null && StringUtils.hasText(profile.getProfessionalTitle())
                        ? profile.getProfessionalTitle()
                        : consultant.getDepartment(),
                profile == null ? null : profile.getYearsExperience(),
                profile == null || profile.getSkills() == null ? List.of() : profile.getSkills(),
                profile == null || profile.getExperience() == null
                        ? List.of()
                        : profile.getExperience().stream()
                                .map(experience -> new ConsultantDashboardResponse.Experience(
                                        experience.getTitle(), experience.getCompany(), experience.getStartDate(),
                                        experience.getEndDate(), experience.getDescription()
                                ))
                                .toList(),
                teamRows,
                submissionRows,
                interviewRows
        );
    }

    private ConsultantDashboardResponse.UpcomingInterview toUpcomingInterview(
            RecruiterInterview interview,
            RecruiterSubmission submission
    ) {
        return new ConsultantDashboardResponse.UpcomingInterview(
                interview.getId(),
                interview.getStartsAt(),
                submission == null ? "" : submission.getJobTitle(),
                submission == null ? "" : submission.getClient(),
                interview.getStage(),
                interview.getType()
        );
    }

    private String userName(User user) {
        if (user == null) return "Unknown";
        if (StringUtils.hasText(user.getFullName())) return user.getFullName();
        return Stream.of(user.getFirstName(), user.getLastName())
                .filter(StringUtils::hasText)
                .collect(Collectors.joining(" "));
    }
}