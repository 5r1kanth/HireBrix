package com.crm.hirebrix.teams;

import com.crm.hirebrix.assignments.ConsultantAssignment;
import com.crm.hirebrix.assignments.ConsultantAssignmentRepository;
import com.crm.hirebrix.teams.dto.CreateTeamRequest;
import com.crm.hirebrix.teams.dto.ManagerDashboardResponse;
import com.crm.hirebrix.teams.dto.UpdateTeamRequest;
import com.crm.hirebrix.teams.dto.TeamLeadDashboardResponse;
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
public class ManagerTeamService {

    private static final String ACTIVE = "Active";

    private final ConsultantAssignmentRepository assignmentRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public ManagerTeamService(
            ConsultantAssignmentRepository assignmentRepository,
            TeamRepository teamRepository,
            UserRepository userRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public ManagerDashboardResponse getDashboard(String managerUserId) {
        User manager = requireUser(managerUserId, "Manager", null);
        String companyId = manager.getCompanyId();
        List<Team> teams = teamRepository.findByCompanyIdAndManagerUserIdAndStatusOrderByCreatedAtDesc(
                companyId, managerUserId, ACTIVE
        );
        List<String> teamIds = teams.stream().map(Team::getId).toList();
        List<ConsultantAssignment> assignments = teamIds.isEmpty()
                ? List.of()
                : assignmentRepository.findByCompanyIdAndTeamIdInAndStatusOrderByAssignedAtDesc(
                        companyId, teamIds, ACTIVE
                );
        Set<String> assignedIds = assignmentRepository.findByCompanyIdAndStatus(companyId, ACTIVE).stream()
                .filter(assignment -> StringUtils.hasText(assignment.getTeamId()))
                .map(ConsultantAssignment::getConsultantUserId)
                .collect(Collectors.toSet());

        Set<String> assignedTeamLeadIds = teamRepository.findByCompanyIdAndStatus(companyId, ACTIVE).stream()
                .map(Team::getTeamLeadUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Set<String> assignedRecruiterIds = teamRepository.findByCompanyIdAndStatus(companyId, ACTIVE).stream()
                .flatMap(team -> team.getRecruiterUserIds() == null ? Stream.empty() : team.getRecruiterUserIds().stream())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<User> activeConsultants = activeUsersByRole(companyId, "Consultant");
        List<ManagerDashboardResponse.ConsultantSummary> consultantSummaries = activeConsultants.stream()
                .map(this::toConsultantSummary)
                .toList();
        List<ManagerDashboardResponse.ConsultantSummary> unassigned = activeConsultants.stream()
                .filter(consultant -> !assignedIds.contains(consultant.getId()))
                .map(this::toConsultantSummary)
                .toList();
        List<User> activeTeamLeadUsers = activeUsersByRole(companyId, "Team Lead");
        List<ManagerDashboardResponse.TeamMemberSummary> allTeamLeads = activeTeamLeadUsers.stream()
                .map(this::toTeamMemberSummary)
                .toList();
        List<ManagerDashboardResponse.TeamMemberSummary> teamLeads = activeTeamLeadUsers
                .stream()
                .filter(user -> !assignedTeamLeadIds.contains(user.getId()))
                .map(this::toTeamMemberSummary)
                .toList();
        List<User> activeRecruiterUsers = activeUsersByRole(companyId, "Recruiter");
        List<ManagerDashboardResponse.TeamMemberSummary> allRecruiters = activeRecruiterUsers.stream()
                .map(this::toTeamMemberSummary)
                .toList();
        List<ManagerDashboardResponse.TeamMemberSummary> recruiters = activeRecruiterUsers
                .stream()
                .filter(user -> !assignedRecruiterIds.contains(user.getId()))
                .map(this::toTeamMemberSummary)
                .toList();

        List<String> relatedUserIds = new ArrayList<>();
        for (Team team : teams) {
            if (team.getTeamLeadUserId() != null) relatedUserIds.add(team.getTeamLeadUserId());
            if (team.getRecruiterUserIds() != null) relatedUserIds.addAll(team.getRecruiterUserIds());
        }
        for (ConsultantAssignment assignment : assignments) {
            if (assignment.getConsultantUserId() != null) relatedUserIds.add(assignment.getConsultantUserId());
        }
        List<String> uniqueRelatedUserIds = relatedUserIds.stream().distinct().toList();
        Map<String, User> usersById = uniqueRelatedUserIds.isEmpty()
                ? Map.of()
                : userRepository.findByIdIn(uniqueRelatedUserIds).stream()
                        .filter(user -> Objects.equals(user.getCompanyId(), companyId) && !user.isDeleted())
                        .collect(Collectors.toMap(User::getId, Function.identity(), (first, ignored) -> first));
        Map<String, List<ConsultantAssignment>> assignmentsByTeam = assignments.stream()
                .collect(Collectors.groupingBy(ConsultantAssignment::getTeamId));

        List<ManagerDashboardResponse.TeamSummary> teamSummaries = new ArrayList<>();
        for (Team team : teams) {
            User teamLead = usersById.get(team.getTeamLeadUserId());
            List<String> recruiterNames = team.getRecruiterUserIds() == null
                    ? List.of()
                    : team.getRecruiterUserIds().stream()
                            .map(usersById::get)
                            .filter(Objects::nonNull)
                            .map(this::userName)
                            .toList();
            List<ManagerDashboardResponse.ConsultantSummary> teamConsultants = assignmentsByTeam
                    .getOrDefault(team.getId(), List.of()).stream()
                    .map(ConsultantAssignment::getConsultantUserId)
                    .map(usersById::get)
                    .filter(Objects::nonNull)
                    .filter(user -> ACTIVE.equalsIgnoreCase(user.getStatus()))
                    .map(this::toConsultantSummary)
                    .toList();
            teamSummaries.add(new ManagerDashboardResponse.TeamSummary(
                                                                                team.getId(), team.getName(), team.getTeamLeadUserId(), userName(teamLead),
                                        team.getRecruiterUserIds() == null ? List.of() : team.getRecruiterUserIds(),
                                        recruiterNames, teamConsultants
            ));
        }

                                return new ManagerDashboardResponse(unassigned, consultantSummaries, teamLeads, allTeamLeads, recruiters, allRecruiters, teamSummaries);
    }

    public Team createTeam(String managerUserId, CreateTeamRequest request) {
        User manager = requireUser(managerUserId, "Manager", null);
        if (request == null || !StringUtils.hasText(request.name())) {
            throw new IllegalArgumentException("Team name is required");
        }
        requireText(request.teamLeadUserId(), "A Team Lead is required");
        if (request.recruiterUserIds() == null || request.recruiterUserIds().isEmpty()) {
            throw new IllegalArgumentException("At least one Recruiter is required");
        }

        String companyId = manager.getCompanyId();
        requireUser(request.teamLeadUserId(), "Team Lead", companyId);
        if (!teamRepository.findByCompanyIdAndTeamLeadUserIdAndStatus(companyId, request.teamLeadUserId(), ACTIVE).isEmpty()) {
            throw new IllegalArgumentException("This Team Lead is already assigned to another active team");
        }

        List<String> recruiterIds = request.recruiterUserIds().stream().distinct().toList();
        recruiterIds.forEach(recruiterId -> requireUser(recruiterId, "Recruiter", companyId));
        for (String recruiterId : recruiterIds) {
            boolean alreadyAssigned = !teamRepository.findByCompanyIdAndRecruiterUserIdsContainingAndStatus(
                    companyId, recruiterId, ACTIVE
            ).isEmpty();
            if (alreadyAssigned) {
                throw new IllegalArgumentException("One or more recruiters are already assigned to another active team");
            }
        }

        Team team = new Team();
        team.setCompanyId(companyId);
        team.setManagerUserId(managerUserId);
        team.setName(request.name().trim());
        team.setTeamLeadUserId(request.teamLeadUserId());
        team.setRecruiterUserIds(recruiterIds);
        team.setStatus(ACTIVE);
        team.setCreatedAt(Instant.now());
        team.setUpdatedAt(Instant.now());
        return teamRepository.save(team);
    }

    public ConsultantAssignment assignConsultant(String managerUserId, String teamId, String consultantUserId) {
        User manager = requireUser(managerUserId, "Manager", null);
        Team team = teamRepository.findByIdAndCompanyIdAndManagerUserIdAndStatus(
                        teamId, manager.getCompanyId(), managerUserId, ACTIVE
                )
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        User consultant = requireUser(consultantUserId, "Consultant", manager.getCompanyId());
        if (!ACTIVE.equalsIgnoreCase(consultant.getStatus())) {
            throw new IllegalArgumentException("Only active consultants can be assigned to a team");
        }

        List<ConsultantAssignment> existingAssignments = assignmentRepository
                .findByCompanyIdAndConsultantUserIdAndStatus(manager.getCompanyId(), consultantUserId, ACTIVE);
        boolean alreadyOnThisTeam = existingAssignments.stream()
                .anyMatch(assignment -> teamId.equals(assignment.getTeamId()));
        if (alreadyOnThisTeam) {
            return existingAssignments.stream()
                    .filter(assignment -> teamId.equals(assignment.getTeamId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Consultant is already assigned to this team"));
        }

        ConsultantAssignment assignment = new ConsultantAssignment();
        assignment.setCompanyId(manager.getCompanyId());
        assignment.setTeamId(teamId);
        assignment.setConsultantUserId(consultant.getId());
        assignment.setAssignedByUserId(managerUserId);
        assignment.setStatus(ACTIVE);
        assignment.setAssignedAt(Instant.now());
        return assignmentRepository.save(assignment);
    }

    public Team addRecruiter(String managerUserId, String teamId, String recruiterUserId) {
        User manager = requireUser(managerUserId, "Manager", null);
        Team team = teamRepository.findByIdAndCompanyIdAndManagerUserIdAndStatus(
                        teamId, manager.getCompanyId(), managerUserId, ACTIVE
                )
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        User recruiter = requireUser(recruiterUserId, "Recruiter", manager.getCompanyId());

        List<String> recruiterIds = team.getRecruiterUserIds() == null
                ? new ArrayList<>()
                : new ArrayList<>(team.getRecruiterUserIds());
        if (recruiterIds.contains(recruiter.getId())) return team;

        boolean assignedToAnotherTeam = !teamRepository
                .findByCompanyIdAndRecruiterUserIdsContainingAndStatus(
                        manager.getCompanyId(), recruiter.getId(), ACTIVE
                ).stream()
                .filter(existingTeam -> !teamId.equals(existingTeam.getId()))
                .toList()
                .isEmpty();
        if (assignedToAnotherTeam) {
            throw new IllegalArgumentException("This Recruiter is already assigned to another active team");
        }

        recruiterIds.add(recruiter.getId());
        team.setRecruiterUserIds(recruiterIds);
        team.setUpdatedAt(Instant.now());
        return teamRepository.save(team);
    }

        public Team updateTeam(String managerUserId, String teamId, UpdateTeamRequest request) {
                User manager = requireUser(managerUserId, "Manager", null);
                if (request == null || !StringUtils.hasText(request.name())) {
                        throw new IllegalArgumentException("Team name is required");
                }
                Team team = teamRepository.findByIdAndCompanyIdAndManagerUserIdAndStatus(
                                                teamId, manager.getCompanyId(), managerUserId, ACTIVE
                                )
                                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

                User teamLead = requireUser(request.teamLeadUserId(), "Team Lead", manager.getCompanyId());
                boolean teamLeadAssignedElsewhere = teamRepository
                                .findByCompanyIdAndTeamLeadUserIdAndStatus(manager.getCompanyId(), teamLead.getId(), ACTIVE)
                                .stream()
                                .anyMatch(existingTeam -> !teamId.equals(existingTeam.getId()));
                if (teamLeadAssignedElsewhere) {
                        throw new IllegalArgumentException("This Team Lead is already assigned to another active team");
                }

                List<String> recruiterIds = request.recruiterUserIds() == null
                                ? List.of()
                                : request.recruiterUserIds().stream().filter(StringUtils::hasText).distinct().toList();
                for (String recruiterId : recruiterIds) {
                        requireUser(recruiterId, "Recruiter", manager.getCompanyId());
                        boolean recruiterAssignedElsewhere = teamRepository
                                        .findByCompanyIdAndRecruiterUserIdsContainingAndStatus(manager.getCompanyId(), recruiterId, ACTIVE)
                                        .stream()
                                        .anyMatch(existingTeam -> !teamId.equals(existingTeam.getId()));
                        if (recruiterAssignedElsewhere) {
                                throw new IllegalArgumentException("One or more recruiters are already assigned to another active team");
                        }
                }

                List<String> consultantIdsToRemove = request.consultantUserIdsToRemove() == null
                                ? List.of()
                                : request.consultantUserIdsToRemove().stream().filter(StringUtils::hasText).distinct().toList();
                if (!consultantIdsToRemove.isEmpty()) {
                        List<ConsultantAssignment> assignments = assignmentRepository
                                        .findByCompanyIdAndTeamIdInAndStatusOrderByAssignedAtDesc(
                                                        manager.getCompanyId(), List.of(teamId), ACTIVE
                                        );
                        Set<String> assignedConsultantIds = assignments.stream()
                                        .map(ConsultantAssignment::getConsultantUserId)
                                        .collect(Collectors.toSet());
                        if (!assignedConsultantIds.containsAll(consultantIdsToRemove)) {
                                throw new IllegalArgumentException("One or more consultants are not assigned to this team");
                        }
                        Instant endedAt = Instant.now();
                        assignments.stream()
                                        .filter(assignment -> consultantIdsToRemove.contains(assignment.getConsultantUserId()))
                                        .forEach(assignment -> {
                                                assignment.setStatus("Inactive");
                                                assignment.setEndedAt(endedAt);
                                                assignmentRepository.save(assignment);
                                        });
                }

                team.setName(request.name().trim());
                team.setTeamLeadUserId(teamLead.getId());
                team.setRecruiterUserIds(new ArrayList<>(recruiterIds));
                team.setUpdatedAt(Instant.now());
                return teamRepository.save(team);
        }

        public List<ManagerDashboardResponse.ConsultantSummary> getTeamLeadConsultants(String teamLeadUserId) {
                User teamLead = requireUser(teamLeadUserId, "Team Lead", null);
                List<Team> teams = teamRepository.findByCompanyIdAndTeamLeadUserIdAndStatus(
                                teamLead.getCompanyId(), teamLeadUserId, ACTIVE
                );
                List<String> teamIds = teams.stream().map(Team::getId).toList();
                if (teamIds.isEmpty()) return List.of();

                List<String> consultantIds = assignmentRepository
                                .findByCompanyIdAndTeamIdInAndStatusOrderByAssignedAtDesc(teamLead.getCompanyId(), teamIds, ACTIVE)
                                .stream()
                                .map(ConsultantAssignment::getConsultantUserId)
                                .distinct()
                                .toList();
                if (consultantIds.isEmpty()) return List.of();

                return userRepository.findByIdIn(consultantIds).stream()
                                .filter(user -> Objects.equals(user.getCompanyId(), teamLead.getCompanyId())
                                                && !user.isDeleted()
                                                && ACTIVE.equalsIgnoreCase(user.getStatus())
                                                && "Consultant".equalsIgnoreCase(user.getRole()))
                                .map(this::toConsultantSummary)
                                .toList();
        }

        public TeamLeadDashboardResponse getTeamLeadDashboard(String teamLeadUserId) {
                User teamLead = requireUser(teamLeadUserId, "Team Lead", null);
                Team team = teamRepository.findByCompanyIdAndTeamLeadUserIdAndStatus(
                                teamLead.getCompanyId(), teamLeadUserId, ACTIVE
                        ).stream()
                        .findFirst()
                        .orElse(null);

                if (team == null) {
                        return new TeamLeadDashboardResponse(null, null, List.of(), List.of());
                }

                List<String> recruiterIds = team.getRecruiterUserIds() == null
                        ? List.of()
                        : team.getRecruiterUserIds().stream()
                                .filter(Objects::nonNull)
                                .distinct()
                                .toList();

                List<String> relatedIds = new ArrayList<>(recruiterIds);
                relatedIds.add(teamLeadUserId);
                Map<String, User> usersById = relatedIds.isEmpty()
                        ? Map.of()
                        : userRepository.findByIdIn(relatedIds).stream()
                                .filter(user -> Objects.equals(user.getCompanyId(), teamLead.getCompanyId()) && !user.isDeleted())
                                .collect(Collectors.toMap(User::getId, Function.identity(), (first, ignored) -> first));

                List<TeamLeadDashboardResponse.TeamMember> recruiters = recruiterIds.stream()
                        .map(usersById::get)
                        .filter(Objects::nonNull)
                        .filter(user -> ACTIVE.equalsIgnoreCase(user.getStatus()))
                        .map(user -> new TeamLeadDashboardResponse.TeamMember(user.getId(), userName(user), user.getEmail()))
                        .toList();

                List<ConsultantAssignment> teamAssignments = assignmentRepository
                        .findByCompanyIdAndTeamIdInAndStatusOrderByAssignedAtDesc(teamLead.getCompanyId(), List.of(team.getId()), ACTIVE);
                List<String> consultantIds = teamAssignments.stream()
                        .map(ConsultantAssignment::getConsultantUserId)
                        .filter(Objects::nonNull)
                        .distinct()
                        .toList();

                List<ManagerDashboardResponse.ConsultantSummary> consultants = consultantIds.isEmpty()
                        ? List.of()
                        : userRepository.findByIdIn(consultantIds).stream()
                                .filter(user -> Objects.equals(user.getCompanyId(), teamLead.getCompanyId())
                                        && !user.isDeleted()
                                        && ACTIVE.equalsIgnoreCase(user.getStatus())
                                        && "Consultant".equalsIgnoreCase(user.getRole()))
                                .map(this::toConsultantSummary)
                                .toList();

                return new TeamLeadDashboardResponse(team.getId(), team.getName(), recruiters, consultants);
        }

        private List<User> activeUsersByRole(String companyId, String role) {
                return userRepository.findByCompanyIdAndRoleAndIsDeletedFalse(companyId, role).stream()
                                .filter(user -> ACTIVE.equalsIgnoreCase(user.getStatus()))
                                .toList();
        }

        private User requireUser(String userId, String role, String companyId) {
                return userRepository.findById(userId)
                                .filter(user -> !user.isDeleted()
                                && ACTIVE.equalsIgnoreCase(user.getStatus())
                                                && role.equalsIgnoreCase(user.getRole())
                                                && (companyId == null || Objects.equals(companyId, user.getCompanyId())))
                                .orElseThrow(() -> new IllegalArgumentException(role + " not found"));
        }

        private ManagerDashboardResponse.ConsultantSummary toConsultantSummary(User user) {
                return new ManagerDashboardResponse.ConsultantSummary(
                                user.getId(), userName(user), user.getEmail(), user.getDepartment()
                );
        }

        private ManagerDashboardResponse.TeamMemberSummary toTeamMemberSummary(User user) {
                return new ManagerDashboardResponse.TeamMemberSummary(user.getId(), userName(user), user.getEmail());
        }

        private String userName(User user) {
                if (user == null) return "Unknown";
                if (StringUtils.hasText(user.getFullName())) return user.getFullName();
                return Stream.of(user.getFirstName(), user.getLastName())
                                .filter(StringUtils::hasText)
                                .collect(Collectors.joining(" "));
        }

        private void requireText(String value, String message) {
                if (!StringUtils.hasText(value)) throw new IllegalArgumentException(message);
        }
}
