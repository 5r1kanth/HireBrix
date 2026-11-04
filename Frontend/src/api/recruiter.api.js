import apiRequest from "./apiClient";

export const getRecruiterDashboard = (recruiterUserId, signal) =>
  apiRequest(`/recruiter/dashboard?recruiterUserId=${encodeURIComponent(recruiterUserId)}`, {
    signal,
  });

export const createRecruiterSubmission = (recruiterUserId, payload) =>
  apiRequest(`/submissions?recruiterUserId=${encodeURIComponent(recruiterUserId)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateRecruiterSubmission = (recruiterUserId, submissionId, payload) =>
  apiRequest(`/submissions/${encodeURIComponent(submissionId)}?recruiterUserId=${encodeURIComponent(recruiterUserId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
