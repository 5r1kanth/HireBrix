import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
import UsersTable from "@/components/Dashboard/UsersTable";
import DashboardMetrics from "@/components/Dashboard/DashboardMetrics";
import AddUserForm from "@/components/Dashboard/AddUserForm";

import { adminInfo, sidebarContents, sidebarFooter, usersColumns } from "@/data/adminData";
import { sidebarHeader, consultancyName, COMPANY_ID } from "@/data/consultancyData";

import { getUsersByCompany } from "@/api/users.api";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeRole, setActiveRole] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Toggle sidebar */
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  /* Fetch users from API */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersByCompany(COMPANY_ID);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* Role counts for metrics (case-sensitive) */
  const roleCounts = useMemo(
    () => ({
      Total: users.length,
      Admin: users.filter((u) => u.role === "Admin").length,
      Manager: users.filter((u) => u.role === "Manager").length,
      "Team Lead": users.filter((u) => u.role === "Team Lead").length,
      Recruiter: users.filter((u) => u.role === "Recruiter").length,
      Consultant: users.filter((u) => u.role === "Consultant").length,
    }),
    [users]
  );

  /* Filtered users based on activeRole */
  const displayedUsers = useMemo(() => {
    if (!activeRole || activeRole === "Total") return users;
    return users.filter((u) => u.role === activeRole);
  }, [activeRole, users]);

  /* Callback after adding a user */
  const handleAddUser = () => {
    fetchUsers();
    setActiveRole(null);
    setSelectedSection(null);
  };

  const addRole = selectedSection?.startsWith("Add ") && selectedSection.replace("Add ", "");

  return (
    <div className="flex p-2 gap-1 bg-gray-100 h-screen">
      {/* Sidebar */}
      <Sidebar
        header={sidebarHeader}
        user={adminInfo}
        contents={sidebarContents}
        footer={sidebarFooter}
        collapsed={!sidebarOpen}
        onMenuClick={toggleSidebar}
        onSelect={(item) => {
          if (!item) {
            setActiveRole(null);
            setSelectedSection(null);
            return;
          }

          if (item.name.startsWith("All ")) {
            // Remove last char if needed
            const role = item.name.replace("All ", "").slice(0, -1);
            setActiveRole(role);
            setSelectedSection(null);
            return;
          }

          if (item.name.startsWith("Add ")) {
            setSelectedSection(item.name);
            setActiveRole(null);
            return;
          }

          setActiveRole(null);
          setSelectedSection(null);
        }}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 gap-1">
        <Topbar title={consultancyName} user={adminInfo} onMenuClick={toggleSidebar} />

        <div className="flex-1 rounded-md">
          {addRole ? (
            <AddUserForm role={addRole} onAddUser={handleAddUser} />
          ) : (
            <>
              {/* Dashboard Metrics */}
              {selectedSection === null && <DashboardMetrics roleCounts={roleCounts} activeRole={activeRole} onRoleSelect={setActiveRole} />}

              {/* Users Table */}
              <UsersTable title={activeRole ? `${activeRole}s` : "All Users"} columns={usersColumns} data={displayedUsers} itemsPerPage={10} loading={loading} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
