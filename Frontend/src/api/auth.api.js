import { getUserById } from "./users.api";

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
