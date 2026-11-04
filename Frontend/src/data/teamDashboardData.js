import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export const managerSidebarContents = [
  { name: "Overview", icon: Squares2X2Icon },
  { name: "Teams", icon: UserGroupIcon },
  { name: "Consultants", icon: UserGroupIcon },
];

export const teamLeadSidebarContents = [
  { name: "My Team", icon: UserGroupIcon },
  { name: "Consultants", icon: UserGroupIcon },
];

export const teamDashboardFooter = [
  { name: "Settings", icon: Cog6ToothIcon },
  { name: "Logout", icon: ArrowRightOnRectangleIcon },
];
