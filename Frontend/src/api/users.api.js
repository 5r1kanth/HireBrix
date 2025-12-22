import apiRequest from "./apiClient";

export const createUser = (user) => {
    return apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(user),
    });
};

export const getUsersByCompany = (companyId) => {
    return apiRequest(`/users?companyId=${companyId}`);
};
