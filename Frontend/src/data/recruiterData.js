import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  UserCircleIcon,
  BriefcaseIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export const sidebarContents = [
  {
    name: "My Submissions",
    icon: ClipboardDocumentListIcon,
    submenu: [
      { name: "Last Month", href: "/recruiter/submissions/last-month" },
      { name: "Last Week", href: "/recruiter/submissions/last-week" },
      { name: "Today", href: "/recruiter/submissions/today" },
    ],
  },
  {
    name: "My Team",
    icon: UserGroupIcon,
    submenu: [
      { name: "Recruiter 1", href: "/recruiter/team/recruiter-1" },
      { name: "Recruiter 2", href: "/recruiter/team/recruiter-2" },
      { name: "Recruiter 3", href: "/recruiter/team/recruiter-3" },
      { name: "Recruiter 4", href: "/recruiter/team/recruiter-4" },
      { name: "Recruiter 5", href: "/recruiter/team/recruiter-5" },
    ],
  },
  {
    name: "Team Lead",
    icon: UserCircleIcon,
    submenu: [
      { name: "Team Lead Name", href: "/recruiter/team-lead" },
    ],
  },
  {
    name: "Manager",
    icon: BriefcaseIcon,
    submenu: [
      { name: "Manager Name", href: "/recruiter/manager" },
    ],
  },
  {
    name: "Generate Report",
    icon: DocumentChartBarIcon,
    href: "/recruiter/generate-report",
  },
];

export const sidebarFooter = [
  {
    name: "Settings",
    icon: Cog6ToothIcon,
    onClick: () => { },
  },
  {
    name: "Logout",
    icon: ArrowRightOnRectangleIcon,
    onClick: () => { },
  },
];



