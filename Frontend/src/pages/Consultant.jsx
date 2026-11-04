import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
import Skillset from "@/components/Dashboard/Skillset";
import Experience from "@/components/Dashboard/Experience";
import UpcomingInterviews from "@/components/Dashboard/UpcomingInterviews";
import Overview from "@/components/Dashboard/Overview";
import RecentSubmissions from "@/components/Dashboard/RecentSubmissions";
import ProfileDetails from "@/components/Dashboard/ProfileDetails";
import InterviewFunnel from "@/components/Dashboard/InterviewFunnel";
import { consultancyName, sidebarHeader } from "@/data/consultancyData";
import { sidebarContents, sidebarFooter } from "@/data/consultantData";
import { getConsultantDashboard } from "@/api/consultant.api";
import { useAuth } from "@/context/AuthContext";

const emptyDashboard = {
  consultantName: "",
  professionalTitle: "",
  yearsExperience: null,
  skills: [],
  experience: [],
  teams: [],
  submissions: [],
  upcomingInterviews: [],
};

const formatMonth = (dateValue) => {
  if (!dateValue) return "Present";
  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(date);
};

const formatDateTime = (dateValue) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));

const isInPeriod = (value, period) => {
  if (!period || ["all time", "all"].includes(period.toLowerCase())) return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const normalizedPeriod = period.toLowerCase();
  if (normalizedPeriod === "today") return date.toDateString() === now.toDateString();
  const days = normalizedPeriod.includes("month") ? 30 : 7;
  return now.getTime() - date.getTime() <= days * 24 * 60 * 60 * 1000;
};

export default function Consultant() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const submissionsContentRef = useRef(null);
  const { user, logout } = useAuth();

  const submissionsOptions = sidebarContents.find((item) => item.name === "My Submissions")?.submenu ?? [];
  const interviewOptions = sidebarContents.find((item) => item.name === "Interviews Taken")?.submenu ?? [];
  const isSubmissionsSelection = submissionsOptions.some((item) => item.name === selectedSection);
  const isInterviewSelection = interviewOptions.some((item) => item.name === selectedSection);

  useEffect(() => {
    if (!user?.id) return undefined;

    const controller = new AbortController();
    let requestInFlight = false;

    const refreshDashboard = async (initial = false) => {
      if (requestInFlight || controller.signal.aborted) return;
      requestInFlight = true;
      if (initial) setLoading(true);
      try {
        const data = await getConsultantDashboard(user.id, controller.signal);
        if (controller.signal.aborted) return;
        setDashboard({ ...emptyDashboard, ...data });
        setLastUpdated(new Date());
        setError("");
      } catch (fetchError) {
        if (!controller.signal.aborted) setError(fetchError.message || "Could not load your dashboard data.");
      } finally {
        requestInFlight = false;
        if (initial && !controller.signal.aborted) setLoading(false);
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refreshDashboard();
    };

    refreshDashboard(true);
    const intervalId = window.setInterval(refreshWhenVisible, 15000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshWhenVisible);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshWhenVisible);
    };
  }, [user?.id]);

  const handleSectionSelect = (item) => {
    setShowProfile(false);
    setSelectedSection(item ? item.name : null);
    if (submissionsOptions.some((option) => option.name === item?.name)) {
      submissionsContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleSidebar = () => setSidebarOpen((previous) => !previous);

  const skills = useMemo(
    () => dashboard.skills.map((skill) => ({
      name: typeof skill === "string" ? skill : skill.name,
      years: typeof skill === "string" ? dashboard.yearsExperience ?? 0 : skill.years ?? dashboard.yearsExperience ?? 0,
    })),
    [dashboard.skills, dashboard.yearsExperience]
  );

  const experience = useMemo(
    () => dashboard.experience.map((item) => ({
      company: item.company || item.title || "Experience",
      from: formatMonth(item.startDate),
      to: formatMonth(item.endDate),
      duration: item.startDate
        ? `${Math.max(0, new Date().getFullYear() - new Date(item.startDate).getFullYear())} yrs`
        : "",
    })),
    [dashboard.experience]
  );

  const visibleSubmissions = useMemo(() => {
    const period = isSubmissionsSelection ? selectedSection : null;
    return dashboard.submissions.filter((submission) => isInPeriod(submission.lastUpdated, period));
  }, [dashboard.submissions, isSubmissionsSelection, selectedSection]);

  const visibleInterviews = useMemo(() => {
    const period = isInterviewSelection ? selectedSection : null;
    return dashboard.upcomingInterviews
      .filter((interview) => isInPeriod(interview.dateTime, period))
      .map((interview) => ({ ...interview, dateTime: formatDateTime(interview.dateTime) }));
  }, [dashboard.upcomingInterviews, isInterviewSelection, selectedSection]);

  const funnelData = useMemo(() => {
    const stages = [
      ["Submitted", "bg-blue-100", "hover:bg-blue-200"],
      ["Screening", "bg-sky-100", "hover:bg-sky-200"],
      ["Interview", "bg-cyan-100", "hover:bg-cyan-200"],
      ["Offer", "bg-teal-100", "hover:bg-teal-200"],
      ["Hired", "bg-green-100", "hover:bg-green-200"],
    ];
    return stages.map(([title, color, hoverColor]) => ({
      title: title === "Hired" ? "Successful" : title,
      value: dashboard.submissions.filter((submission) => submission.stage?.toLowerCase() === title.toLowerCase()).length,
      color,
      hoverColor,
    }));
  }, [dashboard.submissions]);

  return (
    <div className="flex h-screen gap-1 bg-gray-100 p-2">
      <Sidebar
        header={sidebarHeader}
        user={user}
        contents={sidebarContents}
        footer={sidebarFooter}
        collapsed={!sidebarOpen}
        onMenuClick={toggleSidebar}
        onSelect={handleSectionSelect}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Topbar
          title={consultancyName}
          user={user}
          onLogout={logout}
          onMenuClick={toggleSidebar}
          onProfile={() => setShowProfile(true)}
        />

        <div ref={submissionsContentRef} className="flex flex-1 gap-1 overflow-auto rounded-md">
          {showProfile ? (
            <ProfileDetails user={user} />
          ) : (
            <>
              <main className="flex w-9/12 min-w-0 flex-col gap-1">
                <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs shadow">
                  <span className="font-medium text-gray-700">{selectedSection || "Consultant Dashboard"}</span>
                  <span aria-live="polite" className={error ? "text-red-600" : "text-emerald-700"}>
                    {error || (lastUpdated ? `Live · Updated ${lastUpdated.toLocaleTimeString()}` : loading ? "Loading live data..." : "Waiting for data")}
                  </span>
                </div>

                {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

                {isSubmissionsSelection ? (
                  <RecentSubmissions submissions={visibleSubmissions} />
                ) : (
                  <>
                    {(selectedSection === null || selectedSection === "Overview" || selectedSection === "Upcoming Interviews" || isInterviewSelection) && (
                      <div className="flex flex-col gap-1 lg:flex-row">
                        {(selectedSection === null || selectedSection === "Overview") && (
                          <div className="lg:w-8/12">
                            <Overview
                              name={dashboard.consultantName || user?.fullName}
                              professionalTitle={dashboard.professionalTitle}
                              submissions={dashboard.submissions}
                              upcomingInterviews={dashboard.upcomingInterviews}
                            />
                          </div>
                        )}
                        {(selectedSection === null || selectedSection === "Upcoming Interviews" || isInterviewSelection) && (
                          <div className="lg:w-4/12">
                            <UpcomingInterviews interviews={visibleInterviews} />
                          </div>
                        )}
                      </div>
                    )}

                    {(selectedSection === null || selectedSection === "Interview Funnel") && (
                      <InterviewFunnel data={funnelData} />
                    )}

                    {(selectedSection === null || selectedSection === "Recent Submissions") && (
                      <RecentSubmissions submissions={dashboard.submissions} />
                    )}
                  </>
                )}
              </main>

              <aside className="flex w-3/12 flex-col gap-1">
                <section className="rounded-md border bg-white p-2 shadow">
                  <h2 className="mb-2 rounded-t-md bg-blue-100 p-2 text-center text-sm font-semibold text-gray-600">My Teams</h2>
                  {dashboard.teams.length === 0 ? (
                    <p className="p-2 text-xs text-gray-500">No active team assignments.</p>
                  ) : (
                    <div className="space-y-2">
                      {dashboard.teams.map((team) => (
                        <article key={team.teamId} className="rounded border border-gray-200 p-2">
                          <h3 className="text-sm font-semibold text-gray-800">{team.teamName}</h3>
                          <p className="mt-1 text-xs text-gray-600">Team Lead: {team.teamLeadName || "-"}</p>
                          <p className="mt-1 text-xs text-gray-600">Recruiters: {team.recruiterNames?.join(", ") || "-"}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
                <Skillset skills={skills} />
                <Experience experience={experience} />
              </aside>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
