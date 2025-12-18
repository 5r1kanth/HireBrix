import { ClipboardDocumentListIcon, CalendarDaysIcon, UserGroupIcon, UserCircleIcon, BriefcaseIcon, Cog6ToothIcon, AcademicCapIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Logo from "@/assets/colorlogo.png"; // replace with your logo path
import ConsultantPhoto from "@/assets/userProfile.svg"; // replace with consultant photo

export const consultancyName = "Consultancy Name";

export const sidebarHeader = {
  logo: Logo,
  title: "HireBrix",
  subtitle: "Track & Hire",
};

export const consultantInfo = {
  name: "Srikanth Pamulapati",
  photo: ConsultantPhoto, // can use URL or imported image
};

export const sidebarContents = [
  {
    name: "My Submissions",
    icon: ClipboardDocumentListIcon,
    submenu: [
      { name: "Last month", href: "/consultant/submissions/last-month" },
      { name: "Last week", href: "/consultant/submissions/last-week" },
      { name: "Today", href: "/consultant/submissions/today" },
    ],
  },
  {
    name: "Interviews Taken",
    icon: CalendarDaysIcon,
    submenu: [
      { name: "All", href: "/consultant/interviews/all" },
      { name: "Last Month", href: "/consultant/interviews/last-month" },
      { name: "Last Week", href: "/consultant/interviews/last-week" },
    ],
  },
  {
    name: "Skills & Experience",
    icon: AcademicCapIcon,
    href: "/consultant/Skills&Experience",
  },
  {
    name: "Recruiters",
    icon: UserGroupIcon,
    submenu: [
      { name: "Recruiter 1", href: "/Recruiter 1" },
      { name: "Recruiter 2", href: "/Recruiter 2" },
      { name: "Recruiter 3", href: "/Recruiter 3" },
      { name: "Recruiter 4", href: "/Recruiter 4" },
      { name: "Recruiter 5", href: "/Recruiter 5" },
    ],
  },
  {
    name: "Team Lead",
    icon: UserCircleIcon,
    submenu: [
      { name: "Team Lead Name", href: "/TeamLeadName" },
    ],
  },
  {
    name: "Manager",
    icon: BriefcaseIcon,
    submenu: [
      { name: "Manager Name", href: "/Managername" },
    ],
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

export const overviewBoxes = [
  {
    title: "Submissions",
    value: 30,
    subtitle: "12 Active",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    valueColor: "text-blue-900",
  },
  {
    title: "Interview Scheduled",
    value: 9,
    subtitle: "3 Upcoming",
    bgColor: "bg-teal-50",
    hoverColor: "hover:bg-teal-100",
    borderColor: "border-teal-200",
    textColor: "text-teal-600",
    valueColor: "text-teal-900",
  },
  {
    title: "Success Rate",
    value: "10%",
    subtitle: "Interview → Success",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    valueColor: "text-green-900",
  },
];


export const skillsData = [
  { name: "React", years: 6 },
  { name: "Node.js", years: 5 },
  { name: "Python", years: 3 },
  { name: "Django", years: 4 },
  { name: "Tailwind CSS", years: 3 },
  { name: "JavaScript", years: 6 },
  { name: "TypeScript", years: 4 },
  { name: "HTML5", years: 5 },
  { name: "CSS3", years: 5 },
  { name: "Next.js", years: 3 },
  { name: "Express.js", years: 4 },
  { name: "MongoDB", years: 4 },
  { name: "MySQL", years: 3 },
  { name: "GraphQL", years: 2 },
  { name: "Redux", years: 3 },
  { name: "Jest", years: 2 },
  { name: "Git", years: 6 },
  { name: "Docker", years: 2 },
  { name: "AWS", years: 2 },
  { name: "Linux", years: 3 },
  { name: "REST API", years: 4 },
  { name: "Webpack", years: 3 },
  { name: "Chakra UI", years: 2 },
  { name: "Material-UI", years: 3 },
  { name: "Figma", years: 2 },
  { name: "Redux Toolkit", years: 6 },
  { name: "Python Flask", years: 3 },
  { name: "PostgreSQL", years: 4 },
  { name: "SASS", years: 2 },
  { name: "Tailwind UI", years: 3 },
  { name: "Cypress", years: 2 },
];

export const experienceData = [
  {
    company: "Tech Solutions Inc.",
    from: "Jan 2023",
    to: "Present",
    duration: "1 yr 0 mos",
  },
  {
    company: "Innovatech Labs",
    from: "Jun 2021",
    to: "Dec 2022",
    duration: "1 yr 7 mos",
  },
  {
    company: "AlphaSoft Pvt Ltd",
    from: "Mar 2020",
    to: "May 2021",
    duration: "1 yr 3 mos",
  },
  {
    company: "NextGen Systems",
    from: "Jan 2019",
    to: "Feb 2020",
    duration: "1 yr 2 mos",
  },
  {
    company: "CloudWorks",
    from: "Jul 2017",
    to: "Dec 2018",
    duration: "1 yr 6 mos",
  },
  {
    company: "Digital Dynamics",
    from: "Feb 2016",
    to: "Jun 2017",
    duration: "1 yr 5 mos",
  },
  {
    company: "CodeCrafters",
    from: "Aug 2014",
    to: "Jan 2016",
    duration: "1 yr 6 mos",
  },
];

export const upcomingInterviewsData = [
  {
    dateTime: "Nov 21 - 10:00 AM",
    role: "UI Developer",
    client: "Walmart",
    stage: "Screening",
    type: "Client / Vendor",
  },
  {
    dateTime: "Nov 23 - 02:30 PM",
    role: "React Developer",
    client: "Amazon",
    stage: "Technical Round",
    type: "Client",
  },
  {
    dateTime: "Nov 25 - 11:00 AM",
    role: "Frontend Engineer",
    client: "Google",
    stage: "HR Discussion",
    type: "Vendor",
  },
  {
    dateTime: "Nov 25 - 11:00 AM",
    role: "Frontend Engineer",
    client: "Google",
    stage: "HR Discussion",
    type: "Vendor",
  },
];



export const recentSubmissionsData = [
  {
    jobTitle: "UI Developer",
    client: "Walmart",
    vendor: "Tech Mahindra",
    recruiter: "John Doe",
    stage: "Submitted",
    outcome: "Pending",
    lastUpdated: "Nov 18, 2024",
  },
  {
    jobTitle: "Senior React Developer",
    client: "Amazon",
    vendor: "Infosys",
    recruiter: "Jane Smith",
    stage: "Interview",
    outcome: "Scheduled",
    lastUpdated: "Nov 17, 2024",
  },
  {
    jobTitle: "Frontend Engineer",
    client: "Google",
    vendor: "TCS",
    recruiter: "Robert Brown",
    stage: "Screening",
    outcome: "Cleared",
    lastUpdated: "Nov 16, 2024",
  },
  {
    jobTitle: "UI Developer",
    client: "Walmart",
    vendor: "Tech Mahindra",
    recruiter: "John Doe",
    stage: "Submitted",
    outcome: "Pending",
    lastUpdated: "Nov 18, 2024",
  },
  {
    jobTitle: "Senior React Developer",
    client: "Amazon",
    vendor: "Infosys",
    recruiter: "Jane Smith",
    stage: "Interview",
    outcome: "Scheduled",
    lastUpdated: "Nov 17, 2024",
  },
  {
    jobTitle: "Frontend Engineer",
    client: "Google",
    vendor: "TCS",
    recruiter: "Robert Brown",
    stage: "Screening",
    outcome: "Cleared",
    lastUpdated: "Nov 16, 2024",
  },
  {
    jobTitle: "UI Developer",
    client: "Walmart",
    vendor: "Tech Mahindra",
    recruiter: "John Doe",
    stage: "Submitted",
    outcome: "Pending",
    lastUpdated: "Nov 18, 2024",
  },
  {
    jobTitle: "Senior React Developer",
    client: "Amazon",
    vendor: "Infosys",
    recruiter: "Jane Smith",
    stage: "Interview",
    outcome: "Scheduled",
    lastUpdated: "Nov 17, 2024",
  },
  {
    jobTitle: "Frontend Engineer",
    client: "Google",
    vendor: "TCS",
    recruiter: "Robert Brown",
    stage: "Screening",
    outcome: "Cleared",
    lastUpdated: "Nov 16, 2024",
  },
  {
    jobTitle: "UI Developer",
    client: "Walmart",
    vendor: "Tech Mahindra",
    recruiter: "John Doe",
    stage: "Submitted",
    outcome: "Pending",
    lastUpdated: "Nov 18, 2024",
  },
  {
    jobTitle: "UI Developer",
    client: "Walmart",
    vendor: "Tech Mahindra",
    recruiter: "John Doe",
    stage: "Submitted",
    outcome: "Pending",
    lastUpdated: "Nov 18, 2024",
  },
  {
    jobTitle: "Senior React Developer",
    client: "Amazon",
    vendor: "Infosys",
    recruiter: "Jane Smith",
    stage: "Interview",
    outcome: "Scheduled",
    lastUpdated: "Nov 17, 2024",
  },
  {
    jobTitle: "Frontend Engineer",
    client: "Google",
    vendor: "TCS",
    recruiter: "Robert Brown",
    stage: "Screening",
    outcome: "Cleared",
    lastUpdated: "Nov 16, 2024",
  },
  {
    jobTitle: "UI Developer",
    client: "Walmart",
    vendor: "Tech Mahindra",
    recruiter: "John Doe",
    stage: "Submitted",
    outcome: "Pending",
    lastUpdated: "Nov 18, 2024",
  },
];

export const interviewFunnelData = [
  { title: "Submitted", value: 120, color: "bg-blue-100", hoverColor: "bg-blue-200", },
  { title: "Screening", value: 45, color: "bg-sky-100", hoverColor: "bg-sky-200", },
  { title: "Level 1", value: 18, color: "bg-cyan-100", hoverColor: "bg-cyan-200", },
  { title: "Level 2", value: 10, color: "bg-teal-100", hoverColor: "bg-teal-200", },
  { title: "Client", value: 4, color: "bg-emerald-100", hoverColor: "bg-emerald-200", },
  { title: "Successful", value: 2, color: "bg-green-100", hoverColor: "bg-green-200", },
];



