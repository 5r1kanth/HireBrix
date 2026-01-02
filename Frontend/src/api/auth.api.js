import { createUser, getUserById } from "./users.api";
import apiRequest from "./apiClient";
import { createCompany } from "./company.api";

export async function fetchCurrentUser() {
    const userId = localStorage.getItem("userId");

    if (!userId) return null;

    try {
        const user = await getUserById(userId);
        if (!user) return null;

        localStorage.setItem("user", JSON.stringify(user));
        return user;
    } catch (err) {
        console.error("Failed to fetch current user", err);
        return null;
    }
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
        console.log("auth.api.js - payload - ", payload)

        console.log("Company details - ", company)

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

        console.log("User created is - ", createdUser)
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
