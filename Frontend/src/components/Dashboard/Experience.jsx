import React from "react";

export default function Experience({ experience = [] }) {
  return (
    <div className="p-1 border rounded-md bg-white shadow">
      <h2 className="p-2 text-sm font-semibold text-gray-600 bg-blue-100 text-center rounded-t-md">Experience</h2>
      <div className="grid grid-cols-1 gap-1">
        {experience.length === 0 ? (
          <p className="p-2 text-xs text-gray-500">No experience details on file.</p>
        ) : experience.map((exp, index) => (
          <div
            key={index}
            className="bg-white rounded-md shadow px-2 py-1 border border-gray-200 hover:shadow-md hover:bg-gray-100 transition"
          >
            <h3 className="text-sm font-semibold text-gray-800">{exp.company}</h3>
            <p className="text-xs text-gray-600">
              {exp.from} - {exp.to} ({exp.duration})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
