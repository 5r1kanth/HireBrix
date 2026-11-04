package com.crm.hirebrix.teams.dto;

import java.util.List;

public record UpdateTeamRequest(
        String name,
        String teamLeadUserId,
        List<String> recruiterUserIds,
        List<String> consultantUserIdsToRemove
) {}