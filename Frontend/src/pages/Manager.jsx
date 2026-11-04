import { useEffect, useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
import ProfileDetails from "@/components/Dashboard/ProfileDetails";
import ManagerDashboard from "@/components/Dashboard/ManagerDashboard";
import { getManagerDashboard, createManagerTeam, assignConsultantToTeam, addRecruiterToTeam, updateManagerTeam } from "@/api/team.api";
import { useAuth } from "@/context/AuthContext";
import { sidebarHeader, consultancyName } from "@/data/consultancyData";
import { managerSidebarContents, teamDashboardFooter } from "@/data/teamDashboardData";

const emptyDashboard = { unassignedConsultants: [], consultants: [], teamLeads: [], allTeamLeads: [], recruiters: [], allRecruiters: [], teams: [] };

export default function Manager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user?.id) return undefined;
    const controller = new AbortController();
    setLoading(true);
    setError("");

    getManagerDashboard(user.id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setDashboard(data ?? emptyDashboard);
      })
      .catch((fetchError) => {
        if (!controller.signal.aborted) setError(fetchError.message || "Could not load manager dashboard.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [user?.id, refreshVersion]);

  const handleSectionSelect = (item) => {
    setShowProfile(false);
    setSelectedSection(item ? item.name : null);
  };

  const handleCreateTeam = async (payload) => {
    await createManagerTeam(user.id, payload);
    setRefreshVersion((version) => version + 1);
  };

  const handleAssignConsultant = async (teamId, consultantUserId) => {
    await assignConsultantToTeam(user.id, teamId, consultantUserId);
    setRefreshVersion((version) => version + 1);
  };

  const handleAddRecruiter = async (teamId, recruiterUserId) => {
    await addRecruiterToTeam(user.id, teamId, recruiterUserId);
    setRefreshVersion((version) => version + 1);
  };

  const handleUpdateTeam = async (teamId, payload) => {
    await updateManagerTeam(user.id, teamId, payload);
    setRefreshVersion((version) => version + 1);
  };

  const footerItems = teamDashboardFooter.map((item) =>
    item.name === "Settings"
      ? { ...item, onClick: () => handleSectionSelect({ name: "Settings" }) }
      : item
  );

  const toggleSidebar = () => setSidebarOpen((previous) => !previous);

  return (
    <div className="flex h-screen gap-1 bg-gray-100 p-2">
      <Sidebar
        header={sidebarHeader}
        user={user}
        contents={managerSidebarContents}
        footer={footerItems}
        collapsed={!sidebarOpen}
        onMenuClick={toggleSidebar}
        onSelect={handleSectionSelect}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Topbar
          title={consultancyName}
          user={user}
          onLogout={logout}
          onMenuClick={toggleSidebar}
          onSettings={() => handleSectionSelect({ name: "Settings" })}
          onProfile={() => setShowProfile(true)}
        />
        <main className="flex-1 overflow-auto rounded-md">
          {showProfile ? (
            <ProfileDetails user={user} />
          ) : (
            <ManagerDashboard
              selectedSection={selectedSection}
              dashboard={dashboard}
              loading={loading}
              error={error}
              onCreateTeam={handleCreateTeam}
              onAssignConsultant={handleAssignConsultant}
              onAddRecruiter={handleAddRecruiter}
              onUpdateTeam={handleUpdateTeam}
            />
          )}
        </main>
      </div>
    </div>
  );
}
