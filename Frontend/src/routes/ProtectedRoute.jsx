import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { roleMap } from "@/data/adminData";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // 1️⃣ Show loading while AuthProvider is fetching user data
  if (loading) {
    return <div className="text-center p-4">Loading user information...</div>;
  }

  // 2️⃣ If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Normalize role names to match allowedRoles
  const normalizedRole = roleMap[user.role] || user.role;

  // 4️⃣ If allowedRoles is provided, check if the user has permission
  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/login" replace />;
  }

  // 5️⃣ If everything is OK, render the nested route
  return <Outlet />;
}
