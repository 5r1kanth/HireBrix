package com.crm.hirebrix.teams.dto;

import java.util.List;

public record CreateTeamRequest(String name, String teamLeadUserId, List<String> recruiterUserIds) {}