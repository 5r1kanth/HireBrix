import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "@/api/users.api";

export default function ProtectedRoute({ allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const user = await getUserById(userId);

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));

          // normalize roles if needed
          const roleMap = {
            Admin: "Admin",
            Manager: "Manager",
            "Team Lead": "Team Lead",
            Recruiter: "Recruiter",
            HRManager: "HR Manager",
            Consultant: "Consultant",
          };
          const normalizedRole = roleMap[user.role] || user.role;

          if (!allowedRoles || allowedRoles.includes(normalizedRole)) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.error("Auth fetch failed", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [allowedRoles]);

  if (loading) return <div>Loading...</div>;

  return authorized ? <Outlet /> : <Navigate to="/login" replace />;
}
