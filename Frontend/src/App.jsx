import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Consultant from "./pages/Consultant";
import Recruiter from "./pages/Recruiter";
import TeamLead from "./pages/TeamLead";
import Manager from "./pages/Manager";
import HRManager from "./pages/HRManager";
import Admin from "./pages/Admin";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes with Role-based Access */}

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin" element={<Admin />} />
      </Route>

      {/* Manager */}
      <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
        <Route path="/manager" element={<Manager />} />
      </Route>

      {/* Team Lead */}
      <Route element={<ProtectedRoute allowedRoles={["Team Lead"]} />}>
        <Route path="/teamlead" element={<TeamLead />} />
      </Route>

      {/* Recruiter */}
      <Route element={<ProtectedRoute allowedRoles={["Recruiter"]} />}>
        <Route path="/recruiter" element={<Recruiter />} />
      </Route>

      {/* Consultant */}
      <Route element={<ProtectedRoute allowedRoles={["Consultant"]} />}>
        <Route path="/consultant" element={<Consultant />} />
      </Route>

      {/* HR Manager */}
      <Route element={<ProtectedRoute allowedRoles={["HR Manager"]} />}>
        <Route path="/hrmanager" element={<HRManager />} />
      </Route>

      {/* Fallback Route (optional) */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
