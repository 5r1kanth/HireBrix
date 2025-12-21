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

/* =========================
   ADMINS (3)
========================= */
const admins = [
  {
    name: "Alice Johnson",
    email: "alice.admin@company.com",
    role: "Admin",
    department: "Operations",
    status: "Active",
  },
  {
    name: "Brian Adams",
    email: "brian.admin@company.com",
    role: "Admin",
    department: "Compliance",
    status: "Active",
  },
  {
    name: "Catherine Lee",
    email: "catherine.admin@company.com",
    role: "Admin",
    department: "Finance",
    status: "Active",
  },
];

/* =========================
   MANAGERS (6)
========================= */
export const managersData = Array.from({ length: 6 }, (_, i) => ({
  name: `Manager ${i + 1}`,
  email: `manager${i + 1}@company.com`,
  role: "Manager",
  department: ["Sales", "Marketing", "HR", "Engineering", "Delivery", "Support"][i],
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

/* =========================
   TEAM LEADS (18)
========================= */
const teamLeads = Array.from({ length: 18 }, (_, i) => ({
  name: `Team Lead ${i + 1}`,
  email: `teamlead${i + 1}@company.com`,
  role: "Team Lead",
  department: ["Frontend", "Backend", "QA", "DevOps"][i % 4],
  status: "Active",
}));

/* =========================
   RECRUITERS (36)
========================= */
const recruiters = Array.from({ length: 36 }, (_, i) => ({
  name: `Recruiter ${i + 1}`,
  email: `recruiter${i + 1}@company.com`,
  role: "Recruiter",
  department: "Hiring",
  status: i % 3 === 0 ? "Inactive" : "Active",
}));

/* =========================
   USERS DATA (Admins + TLs + Recruiters)
========================= */
export const usersData = [
  ...admins,
  ...teamLeads,
  ...recruiters,
];

/* =========================
   CONSULTANTS (50)
========================= */
export const consultantsData = Array.from({ length: 50 }, (_, i) => ({
  name: `Consultant ${i + 1}`,
  email: `consultant${i + 1}@company.com`,
  role: "Consultant",
  department: ["Frontend", "Backend", "Full Stack", "QA", "UI/UX"][i % 5],
  experience: 2 + (i % 8),
  skills:
    i % 2 === 0
      ? ["React", "TypeScript"]
      : ["Node.js", "MongoDB"],
  status: i % 4 === 0 ? "Inactive" : "Active",
}));
