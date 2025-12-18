import {
    UsersIcon,
    ClipboardDocumentListIcon,
    PencilSquareIcon,
    CalendarIcon,
    ChartBarIcon,
    BuildingLibraryIcon,
    BellIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

export const NAVBAR = {
    navLinks : [
    { name: "Features", href: "#features" },
    { name: "Workflows", href: "#workflows" },
    { name: "Pricing", href: "#pricing" },
  ],
};
export const FEATURES = [
    {
        title: "Consultant Management",
        description:
            "Centralized profiles with skills, documents, performance, and activity tracking.",
        icon: UsersIcon,
        color: "text-purple-500",
    },
    {
        title: "Candidate Pipeline",
        description:
            "Visual pipeline with stage transitions and conversion metrics.",
        icon: ClipboardDocumentListIcon,
        color: "text-blue-400",
    },
    {
        title: "Submission Tracking",
        description:
            "Track client/vendor submissions with status, notes, and activity logs.",
        icon: PencilSquareIcon,
        color: "text-pink-400",
    },
    {
        title: "Interview Automation",
        description:
            "Auto-advances interview stages and sends reminders for upcoming actions.",
        icon: CalendarIcon,
        color: "text-yellow-400",
    },
    {
        title: "Team & KPI Management",
        description:
            "Assign consultants, set KPIs, and monitor daily recruiter activity.",
        icon: ChartBarIcon,
        color: "text-green-400",
    },
    {
        title: "Client & Vendor Management",
        description:
            "Manage client and vendor contacts, submission history, and success rates.",
        icon: BuildingLibraryIcon,
        color: "text-indigo-400",
    },
    {
        title: "Notifications & Reminders",
        description:
            "Automated alerts for submissions, interviews, KPIs, and document expiry.",
        icon: BellIcon,
        color: "text-red-400",
    },
    {
        title: "Document Management",
        description:
            "Upload and manage resumes, certifications, and contracts with versioning.",
        icon: DocumentTextIcon,
        color: "text-teal-400",
    },
    {
        title: "Analytics Dashboard",
        description:
            "Real-time metrics on submissions, interviews, performance, and funnels.",
        icon: ShieldCheckIcon,
        color: "text-orange-400",
    },
    {
        title: "Role-Based Access Control",
        description:
            "Secure role-specific access for Admin, HR, Managers, Leads, and Consultants.",
        icon: UsersIcon,
        color: "text-purple-400",
    },
    {
        title: "Billing & Subscriptions",
        description:
            "Stripe-powered billing with plans, invoices, renewals, and usage tracking.",
        icon: CreditCardIcon,
        color: "text-blue-500",
    },
    {
        title: "Global Search",
        description:
            "Lightning-fast search across consultants, clients, submissions, and documents.",
        icon: MagnifyingGlassIcon,
        color: "text-gray-700",
    },
];

export const WORKFLOW = {
    steps: [
        'Submission & history timeline',
        'Interview scheduling & reschedule flow',
        'Role-based access control',
        'Automated stage movement',
        'Notifications & reminders',
        'Document management & uploads',
    ],
    ui: [
        { role: 'UI Developer', client: 'Client A', status: 'Level 1', time: 'Submitted 2 days ago', color: 'text-gray-700' },
        { role: 'Data Engineer', client: 'Client B', status: 'Successful', time: 'Interviewed today', color: 'text-green-600' },
        { role: 'Fullstack', client: 'Client C', status: 'Pending', time: 'Vendor feedback pending', color: 'text-yellow-600' },
        { role: 'Frontend Developer', client: 'Client D', status: 'Scheduled', time: 'Interview scheduled', color: 'text-blue-600' },
    ],
};

export const HIRINGSTEPS = {
    steps: [
        { title: "Create Workspace", description: "Sign up, invite your team, and set roles & permissions." },
        { title: "Import Candidates", description: "CSV, resume upload, or manual add. Auto-categorize by skills/location." },
        { title: "Track Submissions", description: "Visual pipeline to monitor submission stages and conversion rates." },
        { title: "Track Interviews", description: "Automated reminders and stage progression for interviews." },
        { title: "Analytics & Reporting", description: "Dashboards to monitor submissions, interviews, and team performance." },
    ],
};

export const KEEPTRACK = {
    stats: [
        { label: 'Today', value: '23 Submissions' },
        { label: 'This Week', value: '128 Interviews' },
    ],
};

export const TESTIMONIALS = {
    testimonials: [
        {
            quote:
                "ConsultFlow helped our recruiters reduce time-to-hire by 40%. The visibility and automation are game-changers.",
            author: "Priya R., Head of Talent",
        },
        {
            quote:
                "The predictive engine surfaced consultants we would have missed. Our placement rates improved quickly.",
            author: "Brandon T., Recruiting Manager",
        },
        {
            quote:
                "Having a unified dashboard for submissions and interviews has streamlined our workflow tremendously.",
            author: "Ananya S., HR Manager",
        },
        {
            quote:
                "The automated reminders and KPI tracking keep our team accountable and productive.",
            author: "Rohit K., Team Lead",
        },
    ],
};

export const DARKMODE = {
    changes: [
        'Fine-grained RBAC',
        'Custom fields & templates',
        'Secure document storage',
    ],
};

export const PRICING = {
    plans : [
    {
      name: "Starter",
      price: "$0",
      period: "/ month",
      features: ["Up to 2 users", "Basic submissions", "Email support"],
      buttonText: "Get Started",
      buttonClass:
        "w-full px-4 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors hover:scale-105 transform",
      borderClass: "border-gray-100",
      bgClass: "bg-white",
    },
    {
      name: "Pro",
      price: "$49",
      period: "/ month",
      features: ["Up to 10 users", "Advanced pipeline & analytics", "Priority support"],
      buttonText: "Start Free Trial",
      buttonClass:
        "w-full px-4 py-3 rounded-lg bg-gradient-to-tr from-[var(--electric-blue)] to-[var(--hiring-lime)] text-white font-semibold hover:opacity-90 transition-opacity animate-pulse hover:scale-105 transform",
      borderClass: "border-[var(--hiring-lime)]",
      bgClass: "bg-gradient-to-b from-white to-[#fbf8ff]",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited users", "Dedicated onboarding", "SLA & SSO"],
      buttonText: "Contact Sales",
      buttonClass:
        "w-full px-4 py-3 rounded-lg border border-gray-900 text-gray-900 bg-white font-semibold hover:bg-gray-100 transition-colors hover:scale-105 transform",
      borderClass: "border-gray-100",
      bgClass: "bg-white",
    },
  ],
};