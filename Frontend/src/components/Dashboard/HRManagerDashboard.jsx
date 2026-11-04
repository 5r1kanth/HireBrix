import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const getName = (consultant) =>
  consultant.fullName ||
  [consultant.firstName, consultant.lastName].filter(Boolean).join(" ") ||
  "Unnamed consultant";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function HRManagerDashboard({ selectedSection, consultants = [], loading = false, error = "" }) {
  const itemsPerPage = 10;
  const rowHeight = 40;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredConsultants = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return consultants.filter((consultant) => {
      const searchableFields = [
        getName(consultant),
        consultant.email,
        consultant.department,
        consultant.status,
      ];
      return searchableFields.join(" ").toLowerCase().includes(searchTerm);
    });
  }, [consultants, search]);

  const totalPages = Math.max(1, Math.ceil(filteredConsultants.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const currentConsultants = filteredConsultants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const emptyRows = Math.max(0, itemsPerPage - Math.max(currentConsultants.length, 1));

  const activeCount = consultants.filter((consultant) => consultant.status?.toLowerCase() === "active").length;
  const invitedCount = consultants.filter((consultant) => consultant.status?.toLowerCase() === "invited").length;
  const reviewCount = consultants.filter((consultant) => consultant.status?.toLowerCase() !== "active").length;
  const section = selectedSection || "Overview";
  const title = section === "Overview" ? "HR Manager Dashboard" : section;

  const renderConsultantRows = (rows) => (
    <div className="overflow-x-auto rounded-t-md">
      <table className="w-full min-w-[640px] border-collapse text-xs">
        <thead>
          <tr className="bg-blue-100 text-left text-gray-600">
            <th className="p-2 font-semibold">Consultant</th>
            <th className="p-2 font-semibold">Email</th>
            <th className="p-2 font-semibold">Department</th>
            <th className="p-2 font-semibold">Status</th>
            <th className="p-2 font-semibold">Added</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((consultant) => (
            <tr key={consultant.id} className="border-t text-gray-600 hover:bg-gray-50" style={{ height: rowHeight }}>
              <td className="p-2 font-medium text-gray-800">{getName(consultant)}</td>
              <td className="p-2 break-all">{consultant.email || "-"}</td>
              <td className="p-2">{consultant.department || "-"}</td>
              <td className="p-2">
                <span className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${
                  consultant.status?.toLowerCase() === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {consultant.status || "Unknown"}
                </span>
              </td>
              <td className="p-2">{formatDate(consultant.createdAt)}</td>
            </tr>
          ))}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan="5" className="border-t p-6 text-center text-gray-500" style={{ height: rowHeight }}>
                {search ? "No consultants match your search." : "No consultant accounts found."}
              </td>
            </tr>
          )}
          {loading && (
            <tr>
              <td colSpan="5" className="border-t p-6 text-center text-gray-500" style={{ height: rowHeight }}>Loading consultants...</td>
            </tr>
          )}
          {!loading && Array.from({ length: emptyRows }, (_, index) => (
            <tr key={`empty-${index}`} style={{ height: rowHeight }}>
              <td colSpan="5" className="p-2 border-b-0"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (section === "Offers & Training") {
    return (
      <section className="bg-white rounded-md shadow p-2">
        <h1 className="px-2 text-sm font-semibold text-gray-600">Offers &amp; Training</h1>
        <div className="mt-2 border-t border-gray-100 px-2 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">No offer or training records yet</p>
          <p className="mt-1 text-xs text-gray-500">Offer letters and training records will appear here when that workflow is connected.</p>
        </div>
      </section>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <section className="bg-white rounded-md shadow p-2 flex flex-col gap-2">
        <header className="px-2">
          <h1 className="text-sm font-semibold text-gray-600">{title}</h1>
          <p className="mt-1 text-xs text-gray-500">Consultant onboarding and profile management.</p>
        </header>

        {error && <p role="alert" className="mx-2 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
          {[
            { label: "Consultants", value: consultants.length, surface: "bg-blue-100", color: "text-blue-700" },
            { label: "Active", value: activeCount, surface: "bg-green-100", color: "text-green-700" },
            { label: "Invited", value: invitedCount, surface: "bg-amber-100", color: "text-amber-700" },
            { label: "Needs review", value: reviewCount, surface: "bg-sky-100", color: "text-sky-800" },
          ].map((metric) => (
            <div key={metric.label} className={`${metric.surface} flex min-h-[72px] flex-col items-center justify-center rounded-md border border-gray-200 p-2 text-center`}>
              <p className="mb-1 text-sm font-medium text-gray-500">{metric.label}</p>
              <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 bg-white rounded-md shadow p-2">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
          <h2 className="text-sm font-semibold text-gray-600">
            {section === "Consultants" ? "Consultant Directory" : "Recent Consultants"}
          </h2>
          <label className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search consultants"
              aria-label="Search consultants"
              className="w-full rounded border border-gray-300 py-2 pl-8 pr-2 text-sm outline-none focus:border-blue-500"
            />
          </label>
        </div>
        {renderConsultantRows(currentConsultants)}

        {totalPages > 1 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-2 text-[11px] text-gray-600">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredConsultants.length)} of {filteredConsultants.length}
            </span>
            <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {currentPage} / {totalPages}</span>
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
