import apiRequest from "./apiClient";

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
