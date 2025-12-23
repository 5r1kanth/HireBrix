import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
import UsersTable from "@/components/Dashboard/UsersTable";
import DashboardMetrics from "@/components/Dashboard/DashboardMetrics";
import AddUserForm from "@/components/Dashboard/AddUserForm";

import { adminInfo, sidebarContents, sidebarFooter, usersColumns } from "@/data/adminData";
import { sidebarHeader, consultancyName, COMPANY_ID } from "@/data/consultancyData";

import { getUsersByCompany, updateUser, softDeleteUser, restoreUser } from "@/api/users.api";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeRole, setActiveRole] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // all users including deleted
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const users = await getUsersByCompany(COMPANY_ID); // fetch all users
      setAllUsers(Array.isArray(users) ? users : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Filter active users
  const activeUsers = useMemo(() => allUsers.filter((u) => !u.deleted), [allUsers]);

  // Count metrics for roles (only active users)
  const roleCounts = useMemo(
    () => ({
      Active: activeUsers.length,
      Admin: activeUsers.filter((u) => u.role === "Admin").length,
      Manager: activeUsers.filter((u) => u.role === "Manager").length,
      "Team Lead": activeUsers.filter((u) => u.role === "Team Lead").length,
      Recruiter: activeUsers.filter((u) => u.role === "Recruiter").length,
      Consultant: activeUsers.filter((u) => u.role === "Consultant").length,
      Deleted: allUsers.filter((u) => u.deleted).length,
    }),
    [activeUsers]
  );

  const deletedUsers = useMemo(() => allUsers.filter((u) => u.deleted), [allUsers]);

  // Users to display in table
  const displayedUsers = useMemo(() => {
    if (showDeleted) return deletedUsers;
    if (!activeRole || activeRole === "Active") return activeUsers;
    return activeUsers.filter((u) => u.role === activeRole);
  }, [activeRole, showDeleted, activeUsers, deletedUsers]);

  const addRole = selectedSection?.startsWith("Add ") && selectedSection.replace("Add ", "");

  const handleAddUser = () => {
    fetchAllUsers();
    setActiveRole(null);
    setSelectedSection(null);
    setShowDeleted(false);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      setLoading(true);
      await updateUser(updatedUser.id, updatedUser);
      fetchAllUsers();
    } catch (err) {
      console.error("Failed to update user", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      setLoading(true);
      await softDeleteUser(user.id);
      fetchAllUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreUser = async (user) => {
    try {
      setLoading(true);
      await restoreUser(user.id);
      fetchAllUsers();
    } catch (err) {
      console.error("Failed to restore user", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex p-2 gap-1 bg-gray-100 h-screen">
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
            setShowDeleted(false);
            return;
          }
          if (item.name.startsWith("All ")) {
            const role = item.name.replace("All ", "").slice(0, -1);
            setActiveRole(role);
            setSelectedSection(null);
            setShowDeleted(false);
            return;
          }
          if (item.name.startsWith("Add ")) {
            setSelectedSection(item.name);
            setActiveRole(null);
            setShowDeleted(false);
            return;
          }
          setActiveRole(null);
          setSelectedSection(null);
          setShowDeleted(false);
        }}
      />

      <div className="flex flex-col flex-1 gap-1">
        <Topbar title={consultancyName} user={adminInfo} onMenuClick={toggleSidebar} />

        <div className="flex-1 rounded-md">
          {addRole ? (
            <AddUserForm role={addRole} onAddUser={handleAddUser} />
          ) : (
            <>
              <DashboardMetrics
                roleCounts={roleCounts}
                activeRole={activeRole}
                onRoleSelect={(role) => {
                  if (role === "Deleted") {
                    setShowDeleted(true);
                    setActiveRole(null);
                  } else {
                    setActiveRole(role);
                    setShowDeleted(false);
                  }
                }}
                deletedCount={deletedUsers.length}
              />

              <UsersTable
                title={activeRole ? `${activeRole}s` : showDeleted ? "Deleted Users" : "All Users"}
                columns={usersColumns}
                data={displayedUsers}
                itemsPerPage={10}
                onSave={handleUpdateUser}
                onDelete={handleDeleteUser}
                onRestore={handleRestoreUser}
                showDeleted={showDeleted}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
