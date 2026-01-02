import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
import UsersTable from "@/components/Dashboard/UsersTable";
import DashboardMetrics from "@/components/Dashboard/DashboardMetrics";
import AddUserForm from "@/components/Dashboard/AddUserForm";

import { sidebarContents, sidebarFooter, usersColumns } from "@/data/adminData";
import { sidebarHeader } from "@/data/consultancyData";

import { getUsersByCompany, getDeletedUsersByCompany, updateUser, softDeleteUser, restoreUser, resendInvite } from "@/api/users.api";
// import { logout } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeRole, setActiveRole] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const { user, companyConfig, loading: authLoading, logout } = useAuth();

  const toast = useToast();

  if (authLoading) return <div className="text-center p-4">Loading...</div>;
  if (!user) return <div className="text-center p-4">Not logged in</div>;
  if (!companyConfig) return <div className="text-center p-4">Loading company config...</div>;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const activeUsers = await getUsersByCompany(user.companyId);
      const deletedUsers = await getDeletedUsersByCompany(user.companyId);
      const users = activeUsers.concat(deletedUsers);
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
  }, [user]);

  const activeUsers = useMemo(() => allUsers.filter((u) => !u.deleted), [allUsers]);
  const deletedUsers = useMemo(() => allUsers.filter((u) => u.deleted), [allUsers]);

  const roleCounts = useMemo(
    () => ({
      Active: activeUsers.length,
      Admin: activeUsers.filter((u) => u.role === "Admin").length,
      Manager: activeUsers.filter((u) => u.role === "Manager").length,
      "Team Lead": activeUsers.filter((u) => u.role === "Team Lead").length,
      Recruiter: activeUsers.filter((u) => u.role === "Recruiter").length,
      Consultant: activeUsers.filter((u) => u.role === "Consultant").length,
      Deleted: deletedUsers.length,
    }),
    [activeUsers, deletedUsers]
  );

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
      toast.error(err?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      setLoading(true);
      const result = await softDeleteUser(user.id);
      fetchAllUsers();
      toast.success(result.message || "Deleted successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreUser = async (user) => {
    try {
      setLoading(true);
      const result = await restoreUser(user.id);
      fetchAllUsers();
      toast.success(result.message || "User restored successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to restore user");
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async (userId) => {
    try {
      const result = await resendInvite(userId);
      await fetchAllUsers();
      toast.success(result.message || "Invite resent successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to resend invite");
    }
  };

  const handleSidebarSelect = useCallback((item) => {
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
  }, []);

  return (
    <div className="flex p-2 gap-1 bg-gray-100 h-screen">
      <Sidebar
        header={sidebarHeader}
        user={user}
        contents={sidebarContents}
        footer={sidebarFooter}
        collapsed={!sidebarOpen}
        onMenuClick={toggleSidebar}
        onSelect={handleSidebarSelect}
      />

      <div className="flex flex-col flex-1 gap-1">
        <Topbar user={user} onLogout={logout} onMenuClick={toggleSidebar} />

        <div className="flex-1 rounded-md gap-1 flex flex-col items-center justify-center">
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
                  } else if (role === "Active") {
                    setShowDeleted(false);
                    setActiveRole(null);
                  } else {
                    setShowDeleted(false);
                    setActiveRole(role);
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
                onResendInvite={handleResendInvite}
                showDeleted={showDeleted}
                activeRole={activeRole}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
