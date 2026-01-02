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
