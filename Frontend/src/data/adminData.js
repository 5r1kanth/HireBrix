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
  { label: "Name", accessor: "firstName" },
  { label: "Email", accessor: "email" },
  { label: "Role", accessor: "role" },
  { label: "Department", accessor: "department" },
  { label: "Status", accessor: "status" },
];
