import React from "react";

export default function AssignedConsultants({ consultants = [] }) {
  return (
    <div className="p-1 border rounded-md bg-white shadow">
      {/* Title */}
      <h2 className="p-2 text-sm font-semibold text-gray-600 bg-blue-100 text-center rounded-t-md">
        Assigned Consultants
      </h2>

      {/* Cards */}
      {consultants.length === 0 ? (
        <div className="grid grid-cols-1 gap-1">No consultants assigned</div>
      ) : (
        <div className="flex flex-col gap-3">
          {consultants.map((consultant, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow px-2 py-1 border border-gray-200 hover:shadow-md hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center">
                {/* Consultant Name */}
                <h3 className="w-1/2 text-sm font-semibold text-gray-800 truncate">
                  {consultant.name}
                </h3>

                {/* Role */}
                <p className="w-1/2 text-xs text-gray-600 text-right truncate">{consultant.role}</p>
              </div>
              {/* Primary Skills & Experience */}
              <div className="flex justify-between items-center mt-2">
              <div className="flex flex-wrap gap-2 w-5/6">
                {consultant.primarySkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="w-1/6 text-right">
                <p className="text-xs text-gray-600">{consultant.experience} Years</p>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
