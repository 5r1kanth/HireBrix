import { useMemo } from "react";

export default function useUserFilters({
  allUsers,
  selectedSection,
  activeRoleFilter,
}) {
  /* Sidebar filter */
  const sidebarFilteredUsers = useMemo(() => {
    if (!selectedSection) return allUsers;

    if (selectedSection === "All Managers")
      return allUsers.filter((u) => u.role === "Manager");

    if (selectedSection === "All Team Leads")
      return allUsers.filter((u) => u.role === "Team Lead");

    if (selectedSection === "All Consultants")
      return allUsers.filter((u) => u.role === "Consultant");

    return allUsers;
  }, [selectedSection, allUsers]);

  /* Card filter */
  const displayedUsers = useMemo(() => {
    if (!activeRoleFilter) return sidebarFilteredUsers;
    return sidebarFilteredUsers.filter(
      (u) => u.role === activeRoleFilter
    );
  }, [activeRoleFilter, sidebarFilteredUsers]);

  /* Role counts */
  const roleCounts = useMemo(() => {
    const roles = ["Admin", "Manager", "Team Lead", "Recruiter", "Consultant"];
    return roles.reduce((acc, role) => {
      acc[role] = allUsers.filter((u) => u.role === role).length;
      return acc;
    }, {});
  }, [allUsers]);

  return {
    displayedUsers,
    roleCounts,
  };
}
