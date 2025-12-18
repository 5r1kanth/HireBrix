import React, { useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Topbar from "@/components/Dashboard/Topbar";

import { sidebarHeader, consultancyName } from "@/data/consultancyData";
import {
  sidebarContents,
  sidebarFooter,
  recruiterInfo,
  upcomingInterviewsData,
  assignedConsultantsData,
} from "@/data/recruiterData";
import UpcomingInterviews from "@/components/Dashboard/UpcomingInterviews";
import AssignedConsultants from "@/components/Dashboard/AssignedConsultants";

export default function Recruiter() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex p-2 gap-1 bg-gray-100 h-screen">
      <Sidebar
        header={sidebarHeader}
        user={recruiterInfo} // You can replace with recruiter info later
        contents={sidebarContents} // You can replace with recruiter-specific sidebar
        footer={sidebarFooter}
        collapsed={!sidebarOpen}
        onMenuClick={toggleSidebar}
      />

      <div className="flex flex-col flex-1 gap-1">
        <Topbar
          title={consultancyName} // Change if needed for recruiter view
          user={recruiterInfo} // Replace with recruiter info
          onMenuClick={toggleSidebar}
        />

        <div className="flex-1 flex gap-1 overflow-auto rounded-md">
          {/* LEFT SECTION */}
          <div className="w-9/12 flex flex-col gap-1">
            <div className="rounded-md shadow p-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Recruiter Dashboard
              </h2>
              <p className="text-gray-500 mt-2">
                This is a placeholder for recruiter-specific content.
              </p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-3/12 rounded-br-md gap-1 flex flex-col">
            <AssignedConsultants consultants={assignedConsultantsData} />
            <UpcomingInterviews interviews={upcomingInterviewsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
