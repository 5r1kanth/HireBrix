import { useEffect, useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
import HRManagerDashboard from "@/components/Dashboard/HRManagerDashboard";
import ProfileDetails from "@/components/Dashboard/ProfileDetails";
import { getUsersByCompany } from "@/api/users.api";
import { useAuth } from "@/context/AuthContext";
import { sidebarHeader, consultancyName } from "@/data/consultancyData";
import { hrManagerSidebarContents, hrManagerSidebarFooter } from "@/data/hrManagerData";

export default function HRManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user?.companyId) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    getUsersByCompany(user.companyId)
      .then((users) => {
        if (!cancelled) {
          setConsultants(users.filter((candidate) => candidate.role?.toLowerCase() === "consultant"));
        }
      })
      .catch((fetchError) => {
        if (!cancelled) setError(fetchError.message || "Could not load consultants.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.companyId]);

  const handleSectionSelect = (item) => {
    setShowProfile(false);
    setSelectedSection(item ? item.name : null);
  };

  const footerItems = hrManagerSidebarFooter.map((item) =>
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
        contents={hrManagerSidebarContents}
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
            <HRManagerDashboard
              selectedSection={selectedSection}
              consultants={consultants}
              loading={loading}
              error={error}
            />
          )}
        </main>
      </div>
    </div>
  );
}
