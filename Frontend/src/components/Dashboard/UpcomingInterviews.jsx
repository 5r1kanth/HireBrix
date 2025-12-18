import React from "react";

export default function UpcomingInterviews({ interviews = [] }) {
  return (
    <div className="p-1 border rounded-md bg-white shadow">
      {/* Main Title */}
      <h2 className="p-2 text-sm font-semibold text-gray-600 bg-blue-100 text-center rounded-t-md">
        Upcoming Interviews
      </h2>

      <div className="grid grid-cols-1 gap-1">
        {interviews.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming interviews</p>
        ) : (
          interviews.map((interview, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow p-2 border border-gray-200 hover:shadow-md hover:bg-gray-100 transition"
            >
              {/* Card Title */}
              <h3 className="text-sm font-semibold text-gray-800 flex justify-between items-center">
                {interview.dateTime} <span className="text-gray-600 text-xs"> {interview.client}</span>
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-600 mt-1">
                {interview.role} – {interview.stage} – {interview.type}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
