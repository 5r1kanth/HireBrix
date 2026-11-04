import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const stageOptions = ["Submitted", "Screening", "Interview", "Offer", "Hired"];
const outcomeOptions = ["Pending", "Scheduled", "Cleared", "Rejected", "Withdrawn"];

const stageClasses = {
  Submitted: "bg-sky-100 text-sky-800",
  Screening: "bg-cyan-100 text-cyan-800",
  Interview: "bg-indigo-100 text-indigo-800",
  Offer: "bg-amber-100 text-amber-800",
  Hired: "bg-green-100 text-green-800",
};

const outcomeClasses = {
  Pending: "bg-gray-100 text-gray-700",
  Scheduled: "bg-blue-100 text-blue-800",
  Cleared: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Withdrawn: "bg-orange-100 text-orange-800",
};

const formatDate = (date) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const initialForm = {
  consultantUserId: "",
  jobTitle: "",
  client: "",
  vendor: "",
  stage: "Submitted",
  outcome: "Pending",
  notes: "",
};

export default function RecruiterDashboard({
  selectedSection,
  assignedConsultants = [],
  submissions = [],
  loading = false,
  error = "",
  onCreateSubmission,
  onUpdateSubmission,
}) {
  const itemsPerPage = 10;
  const rowHeight = 40;
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All stages");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      consultantUserId: current.consultantUserId || assignedConsultants[0]?.userId || "",
    }));
  }, [assignedConsultants]);

  const visibleSubmissions = useMemo(() => {
    const now = new Date();
    const period = selectedSection?.toLowerCase();

    return submissions.filter((submission) => {
      const searchText = [
        submission.consultantName,
        submission.jobTitle,
        submission.client,
        submission.vendor,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchText.includes(search.trim().toLowerCase());
      const matchesStage = stageFilter === "All stages" || submission.stage === stageFilter;
      const updatedAt = new Date(submission.lastUpdated);
      const age = now.getTime() - updatedAt.getTime();
      const isToday = updatedAt.toDateString() === now.toDateString();
      const matchesPeriod =
        period === "today"
          ? isToday
          : period === "last week"
            ? age <= 7 * 24 * 60 * 60 * 1000
            : period === "last month"
              ? age <= 30 * 24 * 60 * 60 * 1000
              : true;

      return matchesSearch && matchesStage && matchesPeriod;
    });
  }, [search, stageFilter, submissions, selectedSection]);

  const sortedSubmissions = useMemo(
    () =>
      [...visibleSubmissions].sort((a, b) => {
        const dateA = new Date(a.lastUpdated);
        const dateB = new Date(b.lastUpdated);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }),
    [visibleSubmissions, sortOrder]
  );

  const totalPages = Math.max(1, Math.ceil(sortedSubmissions.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentSubmissions = sortedSubmissions.slice(startIndex, startIndex + itemsPerPage);
  const emptyRows = Math.max(0, itemsPerPage - Math.max(currentSubmissions.length, 1));

  useEffect(() => {
    setPage(1);
  }, [search, stageFilter, selectedSection]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const interviewCount = submissions.filter((submission) => submission.stage === "Interview").length;
  const pendingCount = submissions.filter((submission) => submission.outcome === "Pending").length;

  const updateSubmission = async (id, field, value) => {
    setActionError("");
    try {
      await onUpdateSubmission?.(id, { [field]: value });
    } catch (submitError) {
      setActionError(submitError.message || "Could not update this submission.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionError("");
    setSaving(true);
    try {
      await onCreateSubmission?.(formData);
      setPage(1);
      setFormData({ ...initialForm, consultantUserId: assignedConsultants[0]?.userId ?? "" });
      setShowForm(false);
    } catch (submitError) {
      setActionError(submitError.message || "Could not save this submission.");
    } finally {
      setSaving(false);
    }
  };

  const title = ["Today", "Last Week", "Last Month"].includes(selectedSection)
    ? `${selectedSection} Submissions`
    : "Recruiter Dashboard";

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <section className="bg-white rounded-md shadow p-2 flex flex-col gap-2">
        <header className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div>
            <h1 className="text-sm font-semibold text-gray-600">{title}</h1>
            <p className="mt-1 text-xs text-gray-500">Track submissions and interviews for consultants in your team access.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={assignedConsultants.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4" />
            Add submission
          </button>
        </header>

        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
          {[
            { label: "Team consultants", value: assignedConsultants.length, color: "text-blue-700", surface: "bg-blue-100" },
            { label: "Submissions", value: submissions.length, color: "text-sky-800", surface: "bg-sky-100" },
            { label: "In interview", value: interviewCount, color: "text-indigo-700", surface: "bg-indigo-100" },
            { label: "Awaiting update", value: pendingCount, color: "text-amber-700", surface: "bg-amber-100" },
          ].map((metric) => (
            <div key={metric.label} className={`${metric.surface} border border-gray-200 rounded-md p-4 flex flex-col items-center justify-center text-center transition hover:shadow-sm`}>
              <p className="mb-1 text-sm font-medium text-gray-500">{metric.label}</p>
              <p className={`text-2xl font-bold text-gray-900 ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 bg-white rounded-md shadow p-2">
        {error && <p role="alert" className="m-2 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {actionError && <p role="alert" className="m-2 rounded bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-600">Submissions</h2>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <label className="relative min-w-48 flex-1 sm:flex-none">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search submissions"
                aria-label="Search submissions"
                className="w-full rounded border border-gray-300 py-2 pl-8 pr-2 text-sm outline-none focus:border-blue-500"
              />
            </label>
            <select
              value={stageFilter}
              onChange={(event) => setStageFilter(event.target.value)}
              aria-label="Filter by stage"
              className="rounded border border-gray-300 bg-white px-2 py-2 text-sm text-gray-700"
            >
              <option>All stages</option>
              {stageOptions.map((stage) => <option key={stage}>{stage}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-t-md">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-xs">
            <thead>
              <tr className="bg-blue-100 text-gray-600 text-left">
                <th className="w-[18%] p-2 text-center">Consultant</th>
                <th className="w-[22%] p-2 text-center">Job</th>
                <th className="w-[17%] p-2 text-center">Client / Vendor</th>
                <th className="w-[15%] p-2 text-center">Stage</th>
                <th className="w-[14%] p-2 text-center">Outcome</th>
                <th
                  className="w-[14%] p-2 cursor-pointer select-none text-center"
                  onClick={() => setSortOrder((previous) => previous === "asc" ? "desc" : "asc")}
                >
                  Updated <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSubmissions.map((submission) => (
                <tr key={submission.id} className="border-t text-xs text-gray-500 transition hover:bg-gray-50" style={{ height: rowHeight }}>
                  <td className="p-2 font-medium text-gray-800 text-center whitespace-normal break-words align-middle">{submission.consultantName}</td>
                  <td className="p-2 text-gray-800 text-center whitespace-normal break-words align-middle">
                    <p className="font-medium">{submission.jobTitle}</p>
                    {submission.notes && <p className="mt-1 text-gray-500">{submission.notes}</p>}
                  </td>
                  <td className="p-2 text-center whitespace-normal break-words align-middle">
                    <p className="text-gray-800">{submission.client}</p>
                    <p className="mt-1 text-gray-500">{submission.vendor}</p>
                  </td>
                  <td className="p-2 text-center whitespace-normal break-words align-middle">
                    <select
                      value={submission.stage}
                      onChange={(event) => updateSubmission(submission.id, "stage", event.target.value)}
                      aria-label={`Stage for ${submission.consultantName}, ${submission.jobTitle}`}
                      className={`max-w-full rounded px-2 py-1 text-[10px] font-medium ${stageClasses[submission.stage] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {stageOptions.map((stage) => <option key={stage}>{stage}</option>)}
                    </select>
                  </td>
                  <td className="p-2 text-center whitespace-normal break-words align-middle">
                    <select
                      value={submission.outcome}
                      onChange={(event) => updateSubmission(submission.id, "outcome", event.target.value)}
                      aria-label={`Outcome for ${submission.consultantName}, ${submission.jobTitle}`}
                      className={`max-w-full rounded px-2 py-1 text-[10px] font-medium ${outcomeClasses[submission.outcome] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {outcomeOptions.map((outcome) => <option key={outcome}>{outcome}</option>)}
                    </select>
                  </td>
                  <td className="p-2 text-center whitespace-normal break-words align-middle text-gray-500">{formatDate(submission.lastUpdated)}</td>
                </tr>
              ))}
              {currentSubmissions.length === 0 && (
                <tr>
                  <td colSpan="6" className="border-t p-4 text-center text-gray-500" style={{ height: rowHeight }}>
                    {loading ? "Loading submissions..." : "No submissions match these filters."}
                  </td>
                </tr>
              )}
              {Array.from({ length: emptyRows }, (_, index) => (
                <tr key={`empty-${index}`} style={{ height: rowHeight }}>
                  <td colSpan="6" className="p-2 border-b-0"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-2 text-[11px] text-gray-600">
          <span>
            Showing {sortedSubmissions.length ? startIndex + 1 : 0}-{Math.min(startIndex + currentSubmissions.length, sortedSubmissions.length)} of {sortedSubmissions.length}
          </span>
          <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
            disabled={page === 1}
            className="rounded border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage((previous) => Math.min(previous + 1, totalPages))}
            disabled={page === totalPages}
            className="rounded border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
          </div>
        </div>
      </section>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="submission-form-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-white shadow-xl">
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="submission-form-title" className="font-semibold text-gray-900">Add submission</h2>
                <p className="mt-1 text-xs text-gray-500">Record a consultant submission to a client role.</p>
              </div>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded p-1 text-gray-500 hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </header>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <label className="text-sm text-gray-700">
                Consultant
                <select required value={formData.consultantUserId} onChange={(event) => setFormData({ ...formData, consultantUserId: event.target.value })} className="mt-1 w-full rounded border border-gray-300 bg-white p-2">
                  {assignedConsultants.length === 0 && <option value="">No consultants assigned</option>}
                  {assignedConsultants.map((consultant) => <option key={consultant.userId} value={consultant.userId}>{consultant.name}</option>)}
                </select>
              </label>
              <label className="text-sm text-gray-700">
                Job title
                <input required value={formData.jobTitle} onChange={(event) => setFormData({ ...formData, jobTitle: event.target.value })} className="mt-1 w-full rounded border border-gray-300 p-2" />
              </label>
              <label className="text-sm text-gray-700">
                Client
                <input required value={formData.client} onChange={(event) => setFormData({ ...formData, client: event.target.value })} className="mt-1 w-full rounded border border-gray-300 p-2" />
              </label>
              <label className="text-sm text-gray-700">
                Vendor
                <input required value={formData.vendor} onChange={(event) => setFormData({ ...formData, vendor: event.target.value })} className="mt-1 w-full rounded border border-gray-300 p-2" />
              </label>
              <label className="text-sm text-gray-700">
                Stage
                <select value={formData.stage} onChange={(event) => setFormData({ ...formData, stage: event.target.value })} className="mt-1 w-full rounded border border-gray-300 bg-white p-2">
                  {stageOptions.map((stage) => <option key={stage}>{stage}</option>)}
                </select>
              </label>
              <label className="text-sm text-gray-700">
                Outcome
                <select value={formData.outcome} onChange={(event) => setFormData({ ...formData, outcome: event.target.value })} className="mt-1 w-full rounded border border-gray-300 bg-white p-2">
                  {outcomeOptions.map((outcome) => <option key={outcome}>{outcome}</option>)}
                </select>
              </label>
              <label className="text-sm text-gray-700 sm:col-span-2">
                Notes
                <textarea rows="3" value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} className="mt-1 w-full resize-y rounded border border-gray-300 p-2" />
              </label>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving || assignedConsultants.length === 0} className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving..." : "Save submission"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}