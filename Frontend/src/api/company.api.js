import apiRequest from "./apiClient";

export const createCompany = async (payload) => {
    try {
        const result = await apiRequest("/companies", {
            method: "POST",
            body: JSON.stringify({
                name: payload.companyName,
                domain: payload.email.split("@")[1],
                status: "Active",
            }),
        });
        // console.log("company.api.js - ", result.success, "   -   ", result.data)
        return { success: true, message: "Company created successfully!", data: result };
    } catch (error) {
        return { success: false, message: "Company creation failed!", data: null };
    }
};
/* =========================
   Get a company by ID
========================= */
export const getCompanyById = async (companyId) => {
    try {
        const company = await apiRequest(`/companies/${companyId}`);
        return company; // apiRequest already returns parsed JSON
    } catch (err) {
        console.error("Failed to fetch company by ID:", err);
        return null;
    }
};

/* =========================
   Update company general details
========================= */
export const updateCompany = async (companyId, payload) => {
    try {
        const updated = await apiRequest(`/companies/${companyId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
        return { success: true, data: updated, message: "Company updated successfully" };
    } catch (err) {
        console.error("Failed to update company:", err);
        return { success: false, data: null, message: "Company update failed" };
    }
};

/* =========================
   Get company config
========================= */
export const getCompanyConfig = async (companyId) => {
    try {
        const config = await apiRequest(`/company/${companyId}/config`);
        return config;
    } catch (err) {
        console.error("Failed to fetch company config:", err);
        return null;
    }
};
/* =========================
   Update company config
========================= */
export const updateCompanyConfig = async (companyId, payload) => {
    try {
        const updatedConfig = await apiRequest(`/company/${companyId}/config`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
        return { success: true, data: updatedConfig, message: "Company config updated successfully" };
    } catch (err) {
        console.error("Failed to update company config:", err);
        return { success: false, data: null, message: "Company config update failed" };
    }
};
