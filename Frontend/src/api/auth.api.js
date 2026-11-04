import { createUser, getUserById } from "./users.api";
import apiRequest from "./apiClient";
import { createCompany } from "./company.api";

let currentUserRequest = null;

export function fetchCurrentUser() {
    if (currentUserRequest) return currentUserRequest;

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !accessToken) return Promise.resolve(null);

    currentUserRequest = getUserById(userId)
        .then((user) => {
            if (!user) return null;

            return user;
        })
        .catch((err) => {
        console.error("Failed to fetch current user", err);
            return null;
        })
        .finally(() => {
            currentUserRequest = null;
        });

    return currentUserRequest;
}

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    window.location.href = "/login";
};

const capitalize = (str) =>
    str
        ?.trim()
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) || "";

export const signup = async (payload) => {
    try {
        // Step 1: Create Company
        const result = await createCompany(payload);
        const company = result.data;

        if (company === null)
            return result;

        const user = {
            companyId: company.id,
            email: payload.email.trim(),
            role: "Admin",
            department: "Administration",
            status: "Active",
            firstName: capitalize(payload.firstName).trim(),
            middleName: capitalize(payload.middleName).trim(),
            lastName: capitalize(payload.lastName).trim(),
        };

        const createdUser = await createUser(user);
        if (createdUser === null)
            return { success: true, message: "User creation failed...!!!" };

        // Step 2: Create Admin User
        // const user = await apiRequest("/users", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         companyId: company.id,
        //         firstName,
        //         middleName,
        //         lastName,
        //         fullName: `${firstName} ${middleName || ""} ${lastName}`.trim(),
        //         email,
        //         status: "Invited", // OR Active if no invite flow yet
        //         role: "Admin",
        //     }),
        // });

        return { success: true, message: "Signup successful! Check your email." };

        // return { company, user };
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
};
