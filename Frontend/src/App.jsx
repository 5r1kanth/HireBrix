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
import DesktopGuard from "./components/Guards/DesktopGuard";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <DesktopGuard>
                <Login />
              </DesktopGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <DesktopGuard>
                <Signup />
              </DesktopGuard>
            }
          />

          {/* Protected Routes with Role-based Access */}

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route
              path="/admin"
              element={
                <DesktopGuard>
                  <Admin />
                </DesktopGuard>
              }
            />
          </Route>

          {/* Manager */}
          <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
            <Route
              path="/manager"
              element={
                <DesktopGuard>
                  <Manager />
                </DesktopGuard>
              }
            />
          </Route>

          {/* Team Lead */}
          <Route element={<ProtectedRoute allowedRoles={["Team Lead"]} />}>
            <Route
              path="/teamlead"
              element={
                <DesktopGuard>
                  <TeamLead />
                </DesktopGuard>
              }
            />
          </Route>

          {/* Recruiter */}
          <Route element={<ProtectedRoute allowedRoles={["Recruiter"]} />}>
            <Route
              path="/recruiter"
              element={
                <DesktopGuard>
                  <Recruiter />
                </DesktopGuard>
              }
            />
          </Route>

          {/* Consultant */}
          <Route element={<ProtectedRoute allowedRoles={["Consultant"]} />}>
            <Route
              path="/consultant"
              element={
                <DesktopGuard>
                  <Consultant />
                </DesktopGuard>
              }
            />
          </Route>

          {/* HR Manager */}
          <Route element={<ProtectedRoute allowedRoles={["HR Manager"]} />}>
            <Route
              path="/hrmanager"
              element={
                <DesktopGuard>
                  <HRManager />
                </DesktopGuard>
              }
            />
          </Route>

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <DesktopGuard>
                <Login />
              </DesktopGuard>
            }
          />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
