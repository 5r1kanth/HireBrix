import apiRequest from "./apiClient";

export const getConsultantDashboard = (consultantUserId, signal) =>
  apiRequest(`/consultant/dashboard?consultantUserId=${encodeURIComponent(consultantUserId)}`, { signal });