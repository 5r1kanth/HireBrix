import React from "react";

// Accept skills as props
export default function SkillSet({ skills }) {
  // Group skills by years of experience
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.years]) acc[skill.years] = [];
    acc[skill.years].push(skill.name);
    return acc;
  }, {});

  // Sort years descending
  const sortedYears = Object.keys(groupedSkills)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="p-1 border rounded-md bg-white shadow">
      <h2 className="p-2 text-sm font-semibold text-gray-600 bg-blue-100 text-center rounded-t-md">Skills</h2>

      <div className="grid grid-cols-1 gap-1">
        {sortedYears.map((year) => (
          <div
            key={year}
            className="bg-white rounded-md shadow px-2 py-1 border border-gray-200 hover:shadow-md hover:bg-gray-100 transition"
          >
            {/* Card Title */}
            <h3 className="text-sm font-semibold underline text-gray-800">
              {year}+ {year > 1 ? "Years" : "Year"}
            </h3>

            {/* Skills as comma-separated description */}
            <p className="text-xs text-gray-600">
              {groupedSkills[year].join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
