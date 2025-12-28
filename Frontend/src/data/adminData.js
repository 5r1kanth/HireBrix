import {
  Squares2X2Icon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

/* =========================
   SIDEBAR CONTENTS
========================= */
export const sidebarContents = [
  {
    name: "Managers",
    icon: UsersIcon,
    submenu: [{ name: "All Managers" }, { name: "Add Manager" }],
  },
  {
    name: "Team Lead",
    icon: UsersIcon,
    submenu: [{ name: "All Team Leads" }, { name: "Add Team Lead" }],
  },
  {
    name: "Recruiter",
    icon: UsersIcon,
    submenu: [{ name: "All Recruiters" }, { name: "Add Recruiter" }],
  },
  {
    name: "Consultants",
    icon: UserGroupIcon,
    submenu: [{ name: "All Consultants" }, { name: "Add Consultant" }],
  },
  {
    name: "Reports",
    icon: Squares2X2Icon,
  },
];

/* =========================
   SIDEBAR FOOTER
========================= */
export const sidebarFooter = [
  { name: "Settings", icon: Cog6ToothIcon },
  {
    name: "Logout",
    icon: ArrowRightOnRectangleIcon
  },
];

/* =========================
   Table columns
========================= */
export const usersColumns = [
  { label: "First", accessor: "firstName", width: "140px" },
  { label: "Last", accessor: "lastName", width: "120px" },
  { label: "Email", accessor: "email", width: "220px" },
  { label: "Role", accessor: "role", width: "120px" },
  { label: "Department", accessor: "department", width: "150px" },
  { label: "Status", accessor: "status", width: "100px" },
];


export const ROLE_CONFIG = {
  Admin: "Add Admin",
  Manager: "Add Manager",
  "Team Lead": "Add Team Lead",
  Recruiter: "Add Recruiter",
  Consultant: "Add Consultant",
};

export const roleMap = {
  Admin: "Admin",
  Manager: "Manager",
  "Team Lead": "Team Lead",
  Recruiter: "Recruiter",
  HRManager: "HR Manager",
  Consultant: "Consultant",
};

export const routeMap = {
  Admin: "/admin",
  Manager: "/manager",
  "Team Lead": "/teamlead",
  Recruiter: "/recruiter",
  "HR Manager": "/hrmanager",
  Consultant: "/consultant",
};

export const rowHeight = 40;
export const actionColumnWidth = 120;
