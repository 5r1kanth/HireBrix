import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";
import ProfileDetails from "@/components/Dashboard/ProfileDetails";
import RecruiterDashboard from "@/components/Dashboard/RecruiterDashboard";
import AssignedConsultants from "@/components/Dashboard/AssignedConsultants";
import UpcomingInterviews from "@/components/Dashboard/UpcomingInterviews";
import { getTeamLeadDashboard } from "@/api/team.api";
import {
  createRecruiterSubmission,
  getRecruiterDashboard,
  updateRecruiterSubmission,
} from "@/api/recruiter.api";
import { useAuth } from "@/context/AuthContext";
import { sidebarHeader, consultancyName } from "@/data/consultancyData";
import { teamDashboardFooter, teamLeadSidebarContents } from "@/data/teamDashboardData";

const emptyDashboard = {
  team: {
    teamId: "",
    teamName: "",
    recruiters: [],
    consultants: [],
  },
  assignedConsultants: [],
  submissions: [],
  upcomingInterviews: [],
};

export default function TeamLead() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [dashboardData, setDashboardData] = useState(emptyDashboard);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user?.id) return undefined;

    const controller = new AbortController();
    setDashboardLoading(true);
    setDashboardError("");

    Promise.all([
      getTeamLeadDashboard(user.id, controller.signal),
      getRecruiterDashboard(user.id, controller.signal),
    ])
      .then(([teamData, recruiterData]) => {
        if (controller.signal.aborted) return;
        setDashboardData({
          team: {
            teamId: teamData?.teamId ?? "",
            teamName: teamData?.teamName || "My Team",
            recruiters: teamData?.recruiters ?? [],
            consultants: teamData?.consultants ?? [],
          },
          assignedConsultants: recruiterData?.assignedConsultants ?? [],
          submissions: recruiterData?.submissions ?? [],
          upcomingInterviews: recruiterData?.upcomingInterviews ?? [],
        });
      })
      .catch((fetchError) => {
        if (!controller.signal.aborted) setDashboardError(fetchError.message || "Could not load team dashboard.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setDashboardLoading(false);
      });

    return () => controller.abort();
  }, [user?.id, refreshVersion]);

  const handleCreateSubmission = async (payload) => {
    await createRecruiterSubmission(user.id, payload);
    setRefreshVersion((version) => version + 1);
  };

  const handleUpdateSubmission = async (submissionId, payload) => {
    await updateRecruiterSubmission(user.id, submissionId, payload);
    setRefreshVersion((version) => version + 1);
  };

  const upcomingInterviews = useMemo(
    () => dashboardData.upcomingInterviews.map((interview) => ({
      ...interview,
      dateTime: new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(interview.dateTime)),
    })),
    [dashboardData.upcomingInterviews]
  );

  const recruiterBreakdown = useMemo(
    () =>
      dashboardData.team.recruiters.map((recruiter) => ({
        ...recruiter,
        submissions: dashboardData.submissions.filter((submission) => submission.recruiterUserId === recruiter.userId),
      })),
    [dashboardData.submissions, dashboardData.team.recruiters]
  );

  const handleSectionSelect = (item) => {
    setShowProfile(false);
    setSelectedSection(item ? item.name : null);
  };

  const footerItems = teamDashboardFooter.map((item) =>
    item.name === "Settings"
      ? { ...item, onClick: () => handleSectionSelect({ name: "Settings" }) }
      : item
  );

  const toggleSidebar = () => setSidebarOpen((previous) => !previous);

  return (
    <div className="flex h-screen gap-1 bg-gray-100 p-2">
      <Sidebar
        header={sidebarHeader}
        user={user}
        contents={teamLeadSidebarContents}
        footer={footerItems}
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
          onSettings={() => handleSectionSelect({ name: "Settings" })}
          onProfile={() => setShowProfile(true)}
        />
        <main className="flex-1 overflow-auto rounded-md">
          {showProfile ? (
            <ProfileDetails user={user} />
          ) : (
            <section className="rounded-md bg-white p-2 shadow">
              <header className="px-2 pb-2">
                <h1 className="text-sm font-semibold text-gray-600">{selectedSection || "My Team"}</h1>
                <p className="mt-1 text-xs text-gray-500">Active consultants assigned to your team membership.</p>
              </header>
              {dashboardError && <p role="alert" className="m-2 rounded bg-red-50 p-3 text-sm text-red-700">{dashboardError}</p>}

              <div className="mb-3 rounded-md border border-blue-100 bg-blue-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">Team overview</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{dashboardData.team.teamName || "No active team assigned"}</h2>
                    <p className="text-xs text-gray-500">
                      {dashboardData.team.consultants.length} consultants · {dashboardData.team.recruiters.length} recruiters
                    </p>
                  </div>
                  {dashboardData.team.recruiters.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {dashboardData.team.recruiters.map((recruiter) => (
                        <span key={recruiter.userId} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">
                          {recruiter.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="lg:w-9/12">
                  <RecruiterDashboard
                    selectedSection={selectedSection}
                    assignedConsultants={dashboardData.assignedConsultants}
                    submissions={dashboardData.submissions}
                    loading={dashboardLoading}
                    error={dashboardError}
                    onCreateSubmission={handleCreateSubmission}
                    onUpdateSubmission={handleUpdateSubmission}
                  />
                </div>

                <div className="flex flex-col gap-3 lg:w-3/12">
                  <AssignedConsultants consultants={dashboardData.assignedConsultants} />

                  <div className="rounded-md bg-white p-3 shadow">
                    <h3 className="text-sm font-semibold text-gray-600">Recruiter details</h3>
                    <div className="mt-3 space-y-2">
                      {recruiterBreakdown.length === 0 ? (
                        <p className="text-xs text-gray-500">No recruiters are assigned to this team.</p>
                      ) : (
                        recruiterBreakdown.map((recruiter) => (
                          <div key={recruiter.userId} className="rounded-md border border-gray-200 p-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-gray-800">{recruiter.name}</p>
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                {recruiter.submissions.length} submissions
                              </span>
                            </div>
                            {recruiter.submissions.length === 0 ? (
                              <p className="mt-2 text-xs text-gray-500">No submissions for this recruiter yet.</p>
                            ) : (
                              <ul className="mt-2 space-y-1 text-xs text-gray-600">
                                {recruiter.submissions.slice(0, 3).map((submission) => (
                                  <li key={submission.id} className="rounded bg-gray-50 p-1.5">
                                    <span className="font-medium text-gray-700">{submission.consultantName}</span> · {submission.jobTitle} · {submission.stage}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <UpcomingInterviews interviews={upcomingInterviews} />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
