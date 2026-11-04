import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";

import { sidebarHeader, consultancyName } from "@/data/consultancyData";
import {
  sidebarContents,
  sidebarFooter,
} from "@/data/recruiterData";

import UpcomingInterviews from "@/components/Dashboard/UpcomingInterviews";
import AssignedConsultants from "@/components/Dashboard/AssignedConsultants";
import ProfileDetails from "@/components/Dashboard/ProfileDetails";
import RecruiterDashboard from "@/components/Dashboard/RecruiterDashboard";
import { useAuth } from "@/context/AuthContext";
import {
  createRecruiterSubmission,
  getRecruiterDashboard,
  updateRecruiterSubmission,
} from "@/api/recruiter.api";

const emptyDashboard = {
  assignedConsultants: [],
  submissions: [],
  upcomingInterviews: [],
};

export default function Recruiter() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [dashboardData, setDashboardData] = useState(emptyDashboard);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (!user?.id) return undefined;

    const controller = new AbortController();
    setDashboardLoading(true);
    setDashboardError("");

    getRecruiterDashboard(user.id, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setDashboardData({
          assignedConsultants: data?.assignedConsultants ?? [],
          submissions: data?.submissions ?? [],
          upcomingInterviews: data?.upcomingInterviews ?? [],
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setDashboardError(error.message || "Could not load recruiter dashboard.");
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

  return (
    <div className="flex p-2 gap-1 bg-gray-100 h-screen">
      <Sidebar
        header={sidebarHeader}
        user={user}
        contents={sidebarContents}
        footer={sidebarFooter}
        collapsed={!sidebarOpen}
        onMenuClick={toggleSidebar}
        onSelect={(item) => {
          setShowProfile(false);
          setSelectedSection(item ? item.name : null);
        }}
      />

      <div className="flex flex-col flex-1 gap-1">
        <Topbar
          title={consultancyName}
          user={user}
          onLogout={logout}
          onMenuClick={toggleSidebar}
          onProfile={() => setShowProfile(true)}
        />

        <div className="flex-1 flex gap-1 overflow-auto rounded-md">
          {showProfile ? (
            <ProfileDetails user={user} />
          ) : (
            <>
              {/* LEFT SECTION */}
              <div className="w-9/12 min-w-0 flex flex-col gap-1">
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

              {/* RIGHT SECTION */}
              <div className="w-3/12 rounded-br-md gap-1 flex flex-col">
                {(selectedSection === null || selectedSection === "Assigned Consultants") && (
                  dashboardLoading ? <p className="rounded-md bg-white p-3 text-sm text-gray-500 shadow">Loading consultants...</p> :
                    <AssignedConsultants consultants={dashboardData.assignedConsultants} />
                )}
                {(selectedSection === null || selectedSection === "Upcoming Interviews") && (
                  dashboardLoading ? <p className="rounded-md bg-white p-3 text-sm text-gray-500 shadow">Loading interviews...</p> :
                    <UpcomingInterviews interviews={upcomingInterviews} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
