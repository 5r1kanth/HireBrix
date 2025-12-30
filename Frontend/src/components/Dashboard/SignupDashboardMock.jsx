import React from "react";

export default function SignupDashboardMock() {
  return (
    <div
      className="
        bg-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md
    w-full -translate-y-10
    rotate-[15deg]
    ml-[200px] mt-[200px] z-0
  ">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-32 bg-white/40 rounded-md"></div>
        <div className="h-8 w-8 bg-white/40 rounded-full"></div>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div className="w-20 flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-6 bg-white/30 rounded-md"></div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {["bg-green-400", "bg-blue-400", "bg-orange-400"].map((color, i) => (
              <div key={i} className={`h-16 rounded-lg ${color} opacity-70`}></div>
            ))}
          </div>

          {/* Chart + Metrics */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 h-24 bg-white/30 rounded-lg"></div>
            <div className="w-24 h-24 bg-white/40 rounded-lg"></div>
          </div>

          {/* Table Mock */}
          <div className="bg-white/25 rounded-lg p-4">
            <div className="h-5 bg-white/50 rounded-md mb-3 w-1/3"></div>

            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 mb-2">
              <div className="h-3 bg-white/60 rounded-md"></div>
              <div className="h-3 bg-white/60 rounded-md"></div>
              <div className="h-3 bg-white/60 rounded-md"></div>
              <div className="h-3 bg-white/60 rounded-md"></div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4">
                  <div className="h-3 bg-white/40 rounded-md"></div>
                  <div className="h-3 bg-white/40 rounded-md"></div>
                  <div className="h-3 bg-white/40 rounded-md"></div>
                  <div className="h-3 bg-white/40 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs opacity-90">CRM Dashboard Preview</p>
    </div>
  );
}
