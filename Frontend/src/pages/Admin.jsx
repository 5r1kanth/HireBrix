import { useState, useMemo } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
import UsersTable from "@/components/Dashboard/UsersTable";
import AddUserForm from "@/components/Dashboard/AddUserForm";

import { adminInfo, sidebarContents, sidebarFooter } from "@/data/adminData";
import { sidebarHeader, consultancyName } from "@/data/consultancyData";

// Initial example data
import { usersData as initUsers, managersData as initManagers, consultantsData as initConsultants } from "@/data/adminData";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeRoleFilter, setActiveRoleFilter] = useState(null);

  const [usersData, setUsersData] = useState(initUsers);
  const [managersData, setManagersData] = useState(initManagers);
  const [consultantsData, setConsultantsData] = useState(initConsultants);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Combine all users
  const allUsers = useMemo(() => [...usersData, ...managersData, ...consultantsData], [usersData, managersData, consultantsData]);

  // Sidebar-based filtering
  const sidebarFilteredUsers = useMemo(() => {
    if (!selectedSection) return allUsers;
    if (selectedSection === "All Managers") return allUsers.filter((u) => u.role === "Manager");
    if (selectedSection === "All Team Leads") return allUsers.filter((u) => u.role === "Team Lead");
    if (selectedSection === "All Consultants") return allUsers.filter((u) => u.role === "Consultant");
    return allUsers;
  }, [selectedSection, allUsers]);

  // Card-based filtering
  const displayedUsers = useMemo(() => {
    if (!activeRoleFilter) return sidebarFilteredUsers;
    return sidebarFilteredUsers.filter((u) => u.role === activeRoleFilter);
  }, [activeRoleFilter, sidebarFilteredUsers]);

  // Role counts
  const roleCounts = useMemo(() => {
    return {
      Total: allUsers.length,
      Admin: allUsers.filter((u) => u.role === "Admin").length,
      Manager: allUsers.filter((u) => u.role === "Manager").length,
      "Team Lead": allUsers.filter((u) => u.role === "Team Lead").length,
      Recruiter: allUsers.filter((u) => u.role === "Recruiter").length,
      Consultant: allUsers.filter((u) => u.role === "Consultant").length,
    };
  }, [allUsers]);

  // Table columns
  const usersColumns = [
    { label: "Name", accessor: "name" },
    { label: "Email", accessor: "email" },
    { label: "Role", accessor: "role" },
    { label: "Department", accessor: "department" },
    { label: "Status", accessor: "status" },
    { label: "Experience", accessor: "experience" },
    { label: "Skills", accessor: "skills" },
  ];

  // Add user handler
  const handleAddUser = (newUser) => {
    switch (newUser.role) {
      case "Manager":
        setManagersData((prev) => [newUser, ...prev]);
        break;
      case "Consultant":
        setConsultantsData((prev) => [newUser, ...prev]);
        break;
      default:
        setUsersData((prev) => [newUser, ...prev]);
    }
    setSelectedSection(null);
    setActiveRoleFilter(null);
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
          setSelectedSection(item ? item.name : null);
          setActiveRoleFilter(null);
        }}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 gap-1">
        <Topbar title={consultancyName} user={adminInfo} onMenuClick={toggleSidebar} />

        <div className="flex-1 overflow-auto rounded-md p-4">
          {/* Add User Form */}
          {addRole ? (
            <AddUserForm role={addRole} onAddUser={handleAddUser} />
          ) : (
            <>
              {/* Dashboard Metrics */}
              {selectedSection === null && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                  {Object.entries(roleCounts).map(([role, count]) => (
                    <div
                      key={role}
                      onClick={() => setActiveRoleFilter(activeRoleFilter === role ? null : role)}
                      className={`cursor-pointer rounded-md bg-white shadow p-4 transition border text-center
                        ${activeRoleFilter === role ? "border-[var(--hiring-lime)] ring-2 ring-[var(--hiring-lime)] shadow-lg" : "border-transparent hover:shadow-md"}`}>
                      <span className="text-gray-500 text-md font-bold">{role}</span>
                      <span className="text-2xl font-bold mt-1 block">{count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Users Table */}
              <UsersTable
                title={activeRoleFilter ? `${activeRoleFilter}s` : selectedSection ? selectedSection.replace("All ", "") : "All Users"}
                columns={usersColumns}
                data={displayedUsers}
                itemsPerPage={10}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
