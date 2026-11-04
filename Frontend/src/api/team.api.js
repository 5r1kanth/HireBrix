import apiRequest from "./apiClient";

export const getManagerDashboard = (managerUserId, signal) =>
  apiRequest(`/manager/dashboard?managerUserId=${encodeURIComponent(managerUserId)}`, { signal });

export const createManagerTeam = (managerUserId, payload) =>
  apiRequest(`/manager/teams?managerUserId=${encodeURIComponent(managerUserId)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const assignConsultantToTeam = (managerUserId, teamId, consultantUserId) =>
  apiRequest(
    `/manager/teams/${encodeURIComponent(teamId)}/consultants/${encodeURIComponent(consultantUserId)}?managerUserId=${encodeURIComponent(managerUserId)}`,
    { method: "POST" }
  );

export const addRecruiterToTeam = (managerUserId, teamId, recruiterUserId) =>
  apiRequest(
    `/manager/teams/${encodeURIComponent(teamId)}/recruiters/${encodeURIComponent(recruiterUserId)}?managerUserId=${encodeURIComponent(managerUserId)}`,
    { method: "POST" }
  );

export const updateManagerTeam = (managerUserId, teamId, payload) =>
  apiRequest(`/manager/teams/${encodeURIComponent(teamId)}?managerUserId=${encodeURIComponent(managerUserId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const getTeamLeadConsultants = (teamLeadUserId, signal) =>
  apiRequest(`/teamlead/consultants?teamLeadUserId=${encodeURIComponent(teamLeadUserId)}`, { signal });

export const getTeamLeadDashboard = (teamLeadUserId, signal) =>
  apiRequest(`/teamlead/dashboard?teamLeadUserId=${encodeURIComponent(teamLeadUserId)}`, { signal });
