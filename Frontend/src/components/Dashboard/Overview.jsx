import React from "react";

export default function Overview({ name = "Consultant", professionalTitle = "", submissions = [], upcomingInterviews = [] }) {
  const activeSubmissions = submissions.filter(
    (submission) => !["hired", "rejected", "withdrawn"].includes(submission.outcome?.toLowerCase())
  ).length;
  const successfulSubmissions = submissions.filter(
    (submission) => submission.outcome?.toLowerCase() === "hired" || submission.stage?.toLowerCase() === "hired"
  ).length;
  const successRate = submissions.length
    ? `${Math.round((successfulSubmissions / submissions.length) * 100)}%`
    : "0%";
  const overviewBoxes = [
    {
      title: "Submissions",
      value: submissions.length,
      subtitle: `${activeSubmissions} active`,
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      valueColor: "text-blue-900",
    },
    {
      title: "Interview Scheduled",
      value: upcomingInterviews.length,
      subtitle: "Upcoming",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      borderColor: "border-teal-200",
      textColor: "text-teal-600",
      valueColor: "text-teal-900",
    },
    {
      title: "Success Rate",
      value: successRate,
      subtitle: "Hired / all submissions",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      valueColor: "text-green-900",
    },
  ];

  return (
    <div className="bg-white h-full rounded-md shadow p-2 flex flex-col gap-4">
      {/* Row A: Overview + Current Position */}
      <div className="flex justify-between items-start">
        {/* Overview */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500">{name}</h3>
        </div>

        {/* Present Working Position */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-500">{professionalTitle || "Consultant"}</p>
        </div>
      </div>

      {/* Row B: Three boxes */}
      <div className="grid grid-cols-3 gap-2 h-full">
        {overviewBoxes.map((box, index) => (
          <div
            key={index}
            className={`${box.bgColor} ${box.hoverColor} rounded-md p-3 flex flex-col justify-center text-center border ${box.borderColor}`}
          >
            <p className={`text-sm ${box.textColor}`}>{box.title}</p>
            <p className={`text-xl font-bold ${box.valueColor}`}>{box.value}</p>
            <p className={`text-sm ${box.textColor}`}>{box.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
