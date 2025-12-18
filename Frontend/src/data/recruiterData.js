import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  UserCircleIcon,
  BriefcaseIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/assets/colorlogo.png"; // replace with your logo path
import RecruiterPhoto from "@/assets/userProfile.svg"; // replace with recruiter photo

// export const consultancyName = "Consultancy Name";

// export const sidebarHeader = {
//   logo: Logo,
//   title: "HireBrix",
//   subtitle: "Track & Hire",
// };

export const recruiterInfo = {
  name: "Recruiter Name",
  photo: RecruiterPhoto, // can be URL or imported image
};

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

export const upcomingInterviewsData = [
  {
    dateTime: "Dec 20, 2024 - 10:00 AM",
    candidate: "Rahul Verma",
    role: "Frontend Developer",
    client: "Walmart",
    stage: "Screening",
    type: "Vendor Call",
  },
  {
    dateTime: "Dec 21, 2024 - 02:30 PM",
    candidate: "Ananya Rao",
    role: "React Developer",
    client: "Amazon",
    stage: "Technical Round",
    type: "Client Interview",
  },
  {
    dateTime: "Dec 22, 2024 - 11:00 AM",
    candidate: "Suresh Kumar",
    role: "UI Engineer",
    client: "Google",
    stage: "Technical Round",
    type: "Client Interview",
  },
  {
    dateTime: "Dec 23, 2024 - 04:00 PM",
    candidate: "Priya Sharma",
    role: "Frontend Engineer",
    client: "Microsoft",
    stage: "Managerial Round",
    type: "Client Interview",
  },
  {
    dateTime: "Dec 24, 2024 - 09:30 AM",
    candidate: "Vikram Patel",
    role: "React JS Developer",
    client: "Infosys",
    stage: "HR Discussion",
    type: "Client / Vendor",
  },
  {
    dateTime: "Dec 26, 2024 - 01:00 PM",
    candidate: "Neha Gupta",
    role: "UI Developer",
    client: "Accenture",
    stage: "Final Round",
    type: "Client Interview",
  },
];

export const assignedConsultantsData = [
  {
    name: "Srikanth Pamulapati",
    role: "Senior Frontend Developer",
    experience: 8,
    primarySkills: ["React", "Next.js", "TypeScript"],
  },
  {
    name: "Anita Sharma",
    role: "Full Stack Developer",
    experience: 6,
    primarySkills: ["Node.js", "React", "MongoDB"],
  },
  {
    name: "Rahul Verma",
    role: "UI Developer",
    experience: 4,
    primarySkills: ["HTML", "CSS", "Tailwind"],
  },
];


