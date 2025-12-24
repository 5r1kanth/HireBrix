import apiRequest from "./apiClient";

/* =========================
   Create a new user
========================= */
export const createUser = (user) => {
    return apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(user),
    });
};

/* =========================
   Update an existing user
========================= */
export const updateUser = (userId, user) => {
    return apiRequest(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(user),
    });
};

/* =========================
   Get all active users for a company with optional search
========================= */
export const getUsersByCompany = async (companyId, search = "") => {
    const users = await apiRequest(`/users?companyId=${companyId}${search ? `&search=${search}` : ""}`);
    return Array.isArray(users) ? users : [];
};

/* =========================
   Get all deleted users for a company
========================= */
export const getDeletedUsersByCompany = async (companyId) => {
    const users = await apiRequest(`/users/deleted?companyId=${companyId}`);
    return Array.isArray(users) ? users.filter((u) => u.deleted) : [];
};

/* =========================
   Soft delete a user
========================= */
export const softDeleteUser = (userId) => {
    return apiRequest(`/users/${userId}/delete`, {
        method: "PATCH",
    });
};

/* =========================
   Restore a deleted user
========================= */
export const restoreUser = (userId) => {
    return apiRequest(`/users/${userId}/restore`, {
        method: "PATCH",
        body: JSON.stringify({ isDeleted: false, status: "Active" }),
    });
};
