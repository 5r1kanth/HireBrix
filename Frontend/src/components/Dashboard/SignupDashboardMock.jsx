import React from "react";

export default function SignupDashboardMock() {
  return (
    <div className="relative">
      {/* --- SMALL TOP LEFT CARD --- */}
      <div
        className="
          absolute 
          -top-[120px] -left-[60px]
          bg-white/10 rounded-xl p-4 shadow-lg backdrop-blur-md
          w-[380px] h-[140px]
          rotate-[-18deg]
          z-0
        ">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="h-10 bg-blue-400/70 rounded-md"></div>
          <div className="h-10 bg-indigo-400/70 rounded-md"></div>
        </div>
        <div className="h-4 bg-white/40 rounded-md w-3/4 mb-2"></div>
        <div className="h-3 bg-white/30 rounded-md w-1/2"></div>
      </div>

      {/* --- SMALL BOTTOM LEFT CARD --- */}
      <div
        className="
          absolute 
          top-[160px] -left-[20px]
          bg-white/10 rounded-xl p-4 shadow-md backdrop-blur-md
          w-[170px] h-[130px]
          rotate-[4deg]
          z-0
        ">
        <div className="h-5 bg-white/40 rounded-md w-1/2 mb-3"></div>

        <div className="space-y-2">
          <div className="h-3 bg-white/30 rounded-md w-full"></div>
          <div className="h-3 bg-white/20 rounded-md w-3/4"></div>
          <div className="h-3 bg-white/10 rounded-md w-2/3"></div>
        </div>
      </div>

      {/* --- MAIN LARGE MOCK RIGHT --- */}
      <div
        className="
          bg-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md
          w-full -translate-y-10
          rotate-[15deg]
          ml-[300px] mt-[150px]
          z-10
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
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 bg-white/60 rounded-md"></div>
                ))}
              </div>

              {/* Table Rows */}
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <div key={j} className="h-3 bg-white/40 rounded-md"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs opacity-90">CRM Dashboard Preview</p>
      </div>
    </div>
  );
}
