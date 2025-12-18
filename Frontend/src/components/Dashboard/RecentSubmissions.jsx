import React, { useState, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function RecentSubmissions({ submissions = [] }) {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

  // 🔁 Sort submissions by Last Updated
  const sortedSubmissions = useMemo(() => {
    return [...submissions].sort((a, b) => {
      const dateA = new Date(a.lastUpdated);
      const dateB = new Date(b.lastUpdated);

      return sortOrder === "asc"
        ? dateA - dateB
        : dateB - dateA;
    });
  }, [submissions, sortOrder]);

  // 📄 Pagination logic
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = sortedSubmissions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white rounded-md shadow p-2 flex flex-col h-full">
      {/* Title */}
      <h2 className="text-sm font-semibold text-gray-600 px-2 mb-2">
        Recent Submissions
      </h2>

      {/* Table */}
      <div className="overflow-x-auto flex-1 rounded-t-md">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-blue-100 text-gray-600 text-left">
              <th className="p-2 text-center">Job Title</th>
              <th className="p-2 text-center">Client</th>
              <th className="p-2 text-center">Vendor</th>
              <th className="p-2 text-center">Recruiter</th>
              <th className="p-2 text-center">Stage</th>
              <th className="p-2 text-center">Outcome</th>

              {/* Sortable Column */}
              <th
                className="p-2 cursor-pointer select-none flex items-center justify-center gap-1"
                onClick={() =>
                  setSortOrder((prev) =>
                    prev === "asc" ? "desc" : "asc"
                  )
                }
              >
                Last Updated
                <span className="text-xs">
                  {sortOrder === "asc" ? "↑" : "↓"}
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, index) => (
              <tr
                key={index}
                className="border-t text-xs text-gray-500 hover:bg-gray-50 transition"
              >
                <td className="p-2 font-medium text-gray-800 text-center">
                  {item.jobTitle}
                </td>
                <td className="p-2 text-center">{item.client}</td>
                <td className="p-2 text-center">{item.vendor}</td>
                <td className="p-2 text-center">{item.recruiter}</td>
                <td className="p-2 text-center">{item.stage}</td>
                <td className="p-2 text-center">{item.outcome}</td>
                <td className="p-2 text-center">{item.lastUpdated}</td>
              </tr>
            ))}

            {currentItems.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center text-gray-500"
                >
                  No submissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-3">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-900" />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded text-sm transition ${
                  num === page
                    ? "bg-gray-500 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {num}
              </button>
            )
          )}
        </div>

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={page === totalPages}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-900" />
        </button>
      </div>
    </div>
  );
}
