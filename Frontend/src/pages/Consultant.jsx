import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";

import { skillsData, experienceData, upcomingInterviewsData, recentSubmissionsData, interviewFunnelData, sidebarContents, sidebarFooter } from "@/data/consultantData";

import Skillset from "@/components/Dashboard/Skillset";
import Experience from "@/components/Dashboard/Experience";
import UpcomingInterviews from "@/components/Dashboard/UpcomingInterviews";
import Overview from "@/components/Dashboard/Overview";
import RecentSubmissions from "@/components/Dashboard/RecentSubmissions";
import InterviewFunnel from "@/components/Dashboard/InterviewFunnel";
import { consultancyName, sidebarHeader } from "@/data/consultancyData";
import { fetchCurrentUser, logout } from "@/api/auth.api";

export default function Consultant() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const loadUser = async () => {
    const freshUser = await fetchCurrentUser();
    if (!freshUser) logout();
    else setUser(freshUser);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="flex p-2 gap-1 bg-gray-100 h-screen">
      <Sidebar
        header={sidebarHeader}
        user={user}
        contents={sidebarContents}
        footer={sidebarFooter}
        collapsed={!sidebarOpen}
        onMenuClick={toggleSidebar}
        onSelect={(item) => setSelectedSection(item ? item.name : null)}
      />

      <div className="flex flex-col flex-1 gap-1">
        <Topbar title={consultancyName} user={{ ...user, onLogout: logout }} onMenuClick={toggleSidebar} />

        <div className="flex-1 flex gap-1 overflow-auto rounded-md">
          {/* LEFT SECTION */}
          <div className="w-9/12 flex flex-col gap-1">
            {/* Row 1: Overview + Upcoming Interviews side by side */}
            {(selectedSection === null || selectedSection === "Overview" || selectedSection === "Upcoming Interviews") && (
              <div className="flex gap-1">
                {(selectedSection === null || selectedSection === "Overview") && (
                  <div className="w-8/12 rounded-md shadow">
                    <Overview />
                  </div>
                )}
                {(selectedSection === null || selectedSection === "Upcoming Interviews") && (
                  <div className="w-4/12 rounded-md shadow">
                    <UpcomingInterviews interviews={upcomingInterviewsData} />
                  </div>
                )}
              </div>
            )}

            {/* Row 2: Interview Funnel */}
            {(selectedSection === null || selectedSection === "Interview Funnel") && (
              <div className="rounded-md shadow">
                <InterviewFunnel data={interviewFunnelData} />
              </div>
            )}

            {/* Row 3: Recent Submissions */}
            {(selectedSection === null || selectedSection === "Recent Submissions") && (
              <div className="rounded-md shadow">
                <RecentSubmissions submissions={recentSubmissionsData} />
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="w-3/12 rounded-br-md gap-1 flex flex-col">
            <Skillset skills={skillsData} />
            <Experience experience={experienceData} />
          </div>
        </div>
      </div>
    </div>
  );
}
