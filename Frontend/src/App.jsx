import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Consultant from "./pages/Consultant";
import Recruiter from "./pages/Recruiter";
import TeamLead from "./pages/TeamLead";
import Manager from "./pages/Manager";
import HRManager from "./pages/HRManager";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/consultant" element={<Consultant />} />
      <Route path="/recruiter" element={<Recruiter />} />
      <Route path="/teamlead" element={<TeamLead />} />
      <Route path="/manager" element={<Manager />} />
      <Route path="/hrmanager" element={<HRManager />} />
    </Routes>
  );
}
