import React from "react";

export default function InterviewFunnel({ data = [] }) {
  return (
    <div className="bg-white rounded-md shadow p-2 h-full flex flex-col">
      {/* Title */}
      <h2 className="text-sm font-semibold text-gray-600 px-2 mb-2">Interview Funnel</h2>

      {/* Boxes */}
      <div className="grid grid-cols-6 gap-2 flex-1">
        {data.map((item, index) => (
          <div
            key={index}
            className={`${item.color} hover:${item.hoverColor} border border-gray-200 rounded-md p-4 flex flex-col items-center justify-center text-center hover:shadow-sm transition`}
          >
            <p className="text-sm text-gray-500 mb-1 font-medium">{item.title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
