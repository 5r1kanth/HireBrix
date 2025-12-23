import {
  Squares2X2Icon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import AdminPhoto from "@/assets/userProfile.svg";

/* =========================
   ADMIN INFO (Logged-in Admin)
========================= */
export const adminInfo = {
  name: "Super Admin",
  photo: AdminPhoto,
  hasNotifications: true,
  onLogout: () => console.log("Logout clicked"),
};

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
    icon: ArrowRightOnRectangleIcon,
    onClick: adminInfo.onLogout,
  },
];

// Table columns
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

export const rowHeight = 40;
export const actionColumnWidth = 120;
