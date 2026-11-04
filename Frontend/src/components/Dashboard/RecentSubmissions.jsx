import React, { useState, useMemo } from "react";
const stageColors = {
  submitted: "bg-sky-100 text-sky-700",
  screening: "bg-cyan-100 text-cyan-700",
  interview: "bg-indigo-100 text-indigo-700",
  "technical round": "bg-violet-100 text-violet-700",
  "managerial round": "bg-fuchsia-100 text-fuchsia-700",
  "hr discussion": "bg-pink-100 text-pink-700",
  "final round": "bg-purple-100 text-purple-700",
};

const outcomeColors = {
  pending: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
  cleared: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  declined: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-700",
};

const getBadgeClass = (value, colors) =>
  `inline-flex max-w-full items-center justify-center rounded px-2 py-1 text-[10px] font-medium whitespace-normal break-words ${
    colors[value?.toLowerCase()] ?? "bg-gray-100 text-gray-700"
  }`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function RecentSubmissions({ submissions = [] }) {
  const itemsPerPage = 10;
  const rowHeight = 40;
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
    const totalPages = Math.max(1, Math.ceil(sortedSubmissions.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = sortedSubmissions.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const emptyRows = Math.max(
    0,
    itemsPerPage - Math.max(currentItems.length, 1)
  );
  return (
    <div className="bg-white rounded-md shadow p-2 flex flex-col">
      {/* Title */}
      <h2 className="text-sm font-semibold text-gray-600 px-2 mb-2">
        Recent Submissions
      </h2>

      {/* Table */}
      <div className="overflow-x-auto rounded-t-md">
        <table className="w-full table-fixed text-xs border-collapse">
          <thead>
            <tr className="bg-blue-100 text-gray-600 text-left">
              <th className="w-1/4 p-2 text-center">Job Title</th>
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
                key={item.id ?? `${item.jobTitle}-${item.lastUpdated}-${index}`}
                className="border-t text-xs text-gray-500 hover:bg-gray-50 transition"
                style={{ height: rowHeight }}
              >
                <td className="p-2 font-medium text-gray-800 text-center whitespace-normal break-words align-middle">
                  {item.jobTitle}
                </td>
                <td className="p-2 text-center whitespace-normal break-words align-middle">{item.client}</td>
                <td className="p-2 text-center whitespace-normal break-words align-middle">{item.vendor}</td>
                <td className="p-2 text-center whitespace-normal break-words align-middle">{item.recruiterName || item.recruiter || "-"}</td>
                <td className="p-2 text-center whitespace-normal break-words align-middle">
                  <span className={getBadgeClass(item.stage, stageColors)}>
                    {item.stage}
                  </span>
                </td>
                <td className="p-2 text-center whitespace-normal break-words align-middle">
                  <span className={getBadgeClass(item.outcome, outcomeColors)}>
                    {item.outcome}
                  </span>
                </td>
                <td className="p-2 text-center whitespace-normal break-words align-middle">{formatDate(item.lastUpdated)}</td>
              </tr>
            ))}

            {currentItems.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="border-t p-4 text-center text-gray-500"
                  style={{ height: rowHeight }}
                >
                  No submissions found
                </td>
              </tr>
            )}

            {Array.from({ length: emptyRows }, (_, index) => (
              <tr key={`empty-${index}`} style={{ height: rowHeight }}>
                <td colSpan="7" className="p-2 border-b-0"></td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-2 text-[11px] text-gray-600">
        <span>
          Showing {sortedSubmissions.length ? startIndex + 1 : 0}-{Math.min(startIndex + currentItems.length, sortedSubmissions.length)} of {sortedSubmissions.length}
        </span>
        <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="rounded border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} / {totalPages}</span>
        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={page === totalPages}
          className="rounded border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
        </div>
      </div>
    </div>
  );
}
