import { useState } from "react";
import { PencilSquareIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const emptyTeam = { name: "", teamLeadUserId: "", recruiterUserIds: [] };
const emptyEditTeam = { name: "", teamLeadUserId: "", recruiterUserIds: [], consultantUserIdsToRemove: [] };

function TeamMemberSearchSelect({ team, members, value, onChange, memberType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedMember = members.find((member) => member.userId === value);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.email ?? ""} ${member.department ?? ""}`
      .toLowerCase()
      .includes(normalizedQuery)
  );
  const listboxId = `${memberType}s-for-${team.id}`;

  const selectMember = (member) => {
    onChange(member.userId);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-0 flex-1">
      <input
        type="search"
        role="combobox"
        aria-label={`Search ${memberType}s for ${team.name}`}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        autoComplete="off"
        value={isOpen ? query : selectedMember?.name ?? ""}
        placeholder={members.length ? `Search ${memberType}s` : `No eligible ${memberType}s`}
        disabled={members.length === 0}
        onFocus={() => {
          setQuery("");
          setIsOpen(true);
        }}
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          setQuery(event.target.value);
          onChange("");
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
          if (event.key === "Enter" && filteredMembers[0]) {
            event.preventDefault();
            selectMember(filteredMembers[0]);
          }
        }}
        className="w-full rounded border border-gray-300 bg-white p-2 text-xs outline-none focus:border-blue-500"
      />
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded border border-gray-200 bg-white py-1 shadow-lg"
        >
          {filteredMembers.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-500">No matching {memberType}s.</p>
          ) : (
            filteredMembers.map((member) => (
              <button
                key={member.userId}
                type="button"
                role="option"
                aria-selected={member.userId === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectMember(member)}
                className="flex w-full flex-col px-3 py-2 text-left text-xs hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
              >
                <span className="font-medium text-gray-800">{member.name}</span>
                {(member.email || member.department) && (
                  <span className="mt-0.5 text-[10px] text-gray-500">
                    {[member.email, member.department].filter(Boolean).join(" · ")}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ManagerDashboard({
  selectedSection,
  dashboard = { unassignedConsultants: [], consultants: [], teamLeads: [], recruiters: [], teams: [] },
  loading = false,
  error = "",
  onCreateTeam,
  onAssignConsultant,
  onAddRecruiter,
  onUpdateTeam,
}) {
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [consultantByTeam, setConsultantByTeam] = useState({});
  const [recruiterByTeam, setRecruiterByTeam] = useState({});
  const [editingTeam, setEditingTeam] = useState(null);
  const [editTeamForm, setEditTeamForm] = useState(emptyEditTeam);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [consultantPage, setConsultantPage] = useState(1);
  const section = selectedSection || "Overview";
  const teams = dashboard.teams ?? [];
  const consultants = dashboard.unassignedConsultants ?? [];
  const assignableConsultants = dashboard.consultants ?? [
    ...consultants,
    ...teams.flatMap((team) => team.consultants ?? []),
  ].filter((consultant, index, list) => list.findIndex((item) => item.userId === consultant.userId) === index);
  const teamLeads = dashboard.teamLeads ?? [];
  const allTeamLeads = dashboard.allTeamLeads ?? teamLeads;
  const recruiters = dashboard.recruiters ?? [];
  const allRecruiters = dashboard.allRecruiters ?? recruiters;
  const assignedCount = new Set(
    teams.flatMap((team) => (team.consultants ?? []).map((consultant) => consultant.userId))
  ).size;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(consultants.length / pageSize));
  const safePage = Math.min(consultantPage, totalPages);
  const paginatedConsultants = consultants.slice((safePage - 1) * pageSize, safePage * pageSize);

  const goToPreviousConsultantPage = () => setConsultantPage((current) => Math.max(1, current - 1));
  const goToNextConsultantPage = () => setConsultantPage((current) => Math.min(totalPages, current + 1));

  const createTeam = async (event) => {
    event.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      await onCreateTeam(teamForm);
      setTeamForm(emptyTeam);
    } catch (createError) {
      setActionError(createError.message || "Could not create team.");
    } finally {
      setSaving(false);
    }
  };

  const assignConsultant = async (teamId) => {
    const consultantUserId = consultantByTeam[teamId];
    if (!consultantUserId) return;
    setSaving(true);
    setActionError("");
    try {
      await onAssignConsultant(teamId, consultantUserId);
      setConsultantByTeam((current) => ({ ...current, [teamId]: "" }));
    } catch (assignError) {
      setActionError(assignError.message || "Could not assign consultant.");
    } finally {
      setSaving(false);
    }
  };

  const addRecruiter = async (teamId) => {
    const recruiterUserId = recruiterByTeam[teamId];
    if (!recruiterUserId) return;
    setSaving(true);
    setActionError("");
    try {
      await onAddRecruiter(teamId, recruiterUserId);
      setRecruiterByTeam((current) => ({ ...current, [teamId]: "" }));
    } catch (addError) {
      setActionError(addError.message || "Could not add recruiter to this team.");
    } finally {
      setSaving(false);
    }
  };

  const openTeamEditor = (team) => {
    setEditingTeam(team);
    setEditTeamForm({
      name: team.name,
      teamLeadUserId: team.teamLeadUserId ?? "",
      recruiterUserIds: team.recruiterUserIds ?? [],
      consultantUserIdsToRemove: [],
    });
    setActionError("");
  };

  const updateTeam = async (event) => {
    event.preventDefault();
    if (!editingTeam) return;
    setSaving(true);
    setActionError("");
    try {
      await onUpdateTeam(editingTeam.id, editTeamForm);
      setEditingTeam(null);
      setEditTeamForm(emptyEditTeam);
    } catch (updateError) {
      setActionError(updateError.message || "Could not update this team.");
    } finally {
      setSaving(false);
    }
  };

  const toggleEditListItem = (field, userId) => {
    setEditTeamForm((current) => ({
      ...current,
      [field]: current[field].includes(userId)
        ? current[field].filter((currentId) => currentId !== userId)
        : [...current[field], userId],
    }));
  };

  const editTeamLeads = editingTeam
    ? [...teamLeads, ...allTeamLeads.filter((member) => member.userId === editingTeam.teamLeadUserId)]
        .filter((member, index, list) => list.findIndex((item) => item.userId === member.userId) === index)
    : [];
  const editTeamRecruiters = editingTeam
    ? [...recruiters, ...allRecruiters.filter((member) => (editingTeam.recruiterUserIds ?? []).includes(member.userId))]
        .filter((member, index, list) => list.findIndex((item) => item.userId === member.userId) === index)
    : [];

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <section className="rounded-md bg-white p-2 shadow">
        <header className="mb-2 px-2">
          <h1 className="text-sm font-semibold text-gray-600">
            {section === "Overview" ? "Manager Dashboard" : section}
          </h1>
          <p className="mt-1 text-xs text-gray-500">Review active consultants and assign them to the right team.</p>
        </header>

        {error && <p role="alert" className="mx-2 mb-2 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {actionError && <p role="alert" className="mx-2 mb-2 rounded bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}

        <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
          {[
            { label: "Available consultants", value: consultants.length, surface: "bg-blue-100", color: "text-blue-700" },
            { label: "Active teams", value: teams.length, surface: "bg-indigo-100", color: "text-indigo-700" },
            { label: "Assigned consultants", value: assignedCount, surface: "bg-green-100", color: "text-green-700" },
          ].map((metric) => (
            <div key={metric.label} className={`${metric.surface} flex min-h-20 flex-col items-center justify-center rounded-md border border-gray-200 p-2 text-center`}>
              <p className="mb-1 text-[11px] font-medium text-gray-500">{metric.label}</p>
              <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      {(section === "Overview" || section === "Teams") && (
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-md bg-white p-3 shadow">
            <h2 className="mb-3 text-sm font-semibold text-gray-600">Create a team</h2>
            <form onSubmit={createTeam} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="text-xs font-medium text-gray-600">
                Team name
                <input required value={teamForm.name} onChange={(event) => setTeamForm({ ...teamForm, name: event.target.value })} className="mt-1 w-full rounded border border-gray-300 p-2 text-sm font-normal" placeholder="e.g. Frontend Hiring" />
              </label>

              <label className="text-xs font-medium text-gray-600">
                Team Lead
                <select required value={teamForm.teamLeadUserId} onChange={(event) => setTeamForm({ ...teamForm, teamLeadUserId: event.target.value })} className="mt-1 w-full rounded border border-gray-300 bg-white p-2 text-sm font-normal">
                  <option value="">Select a Team Lead</option>
                  {teamLeads.map((member) => <option key={member.userId} value={member.userId}>{member.name}</option>)}
                </select>
              </label>

              <label className="text-xs font-medium text-gray-600 md:col-span-2">
                Recruiters
                <select
                  multiple
                  size={Math.min(6, Math.max(3, recruiters.length || 3))}
                  value={teamForm.recruiterUserIds}
                  onChange={(event) => {
                    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
                    setTeamForm({
                      ...teamForm,
                      recruiterUserIds: selected,
                    });
                  }}
                  className="mt-1 w-full rounded border border-gray-300 bg-white p-2 text-sm font-normal"
                  aria-label="Select recruiters"
                >
                  {recruiters.map((member) => <option key={member.userId} value={member.userId}>{member.name}</option>)}
                </select>
                <p className="mt-1 text-[10px] text-gray-500">Use Ctrl/Cmd to select multiple recruiters from the dropdown.</p>
              </label>

              <div className="md:col-span-2 flex items-end">
                <button type="submit" disabled={saving || !teamLeads.length || !recruiters.length} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <PlusIcon className="h-4 w-4" />
                  Create team
                </button>
              </div>
            </form>

            <p className="mt-3 text-xs text-gray-600">
              <span className="font-medium">Team rule:</span> each Team Lead and Recruiter can belong to only one active team, while Consultants can be assigned to multiple teams.
            </p>
            {(!teamLeads.length || !recruiters.length) && (
              <p className="mt-3 text-xs text-amber-700">You need at least one active Team Lead and one active Recruiter to create a team.</p>
            )}
          </section>

          {(section === "Overview" || section === "Consultants") && (
            <section className="rounded-md bg-white p-3 shadow">
              <h2 className="mb-3 text-sm font-semibold text-gray-600">Available consultants</h2>
              {loading ? (
                <p className="border-t p-6 text-center text-sm text-gray-500">Loading consultants...</p>
              ) : consultants.length === 0 ? (
                <p className="border-t p-6 text-center text-sm text-gray-500">No active consultants are waiting to be assigned.</p>
              ) : (
                <div className="space-y-2">
                  <div className="overflow-x-auto overflow-y-hidden rounded-md border border-gray-200" style={{ height: `${36 * pageSize + 4}px` }}>
                    <table className="h-full w-full min-w-[320px] table-fixed border-collapse text-xs">
                      <thead>
                        <tr className="h-8 bg-blue-50 text-left text-gray-600">
                          <th className="p-2">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Dept</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedConsultants.map((consultant) => (
                          <tr key={consultant.userId} className="h-8 border-t text-gray-600">
                            <td title={consultant.name} className="truncate whitespace-nowrap p-2 font-medium text-gray-800">{consultant.name}</td>
                            <td title={consultant.email} className="truncate whitespace-nowrap p-2">{consultant.email}</td>
                            <td title={consultant.department || "-"} className="truncate whitespace-nowrap p-2">{consultant.department || "-"}</td>
                          </tr>
                        ))}
                        {Array.from({ length: Math.max(0, pageSize - paginatedConsultants.length) }).map((_, index) => (
                          <tr key={`empty-${index}`} className="h-8 border-t text-gray-600">
                            <td className="truncate whitespace-nowrap p-2 text-transparent">-</td>
                            <td className="truncate whitespace-nowrap p-2 text-transparent">-</td>
                            <td className="truncate whitespace-nowrap p-2 text-transparent">-</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-2 text-[11px] text-gray-600">
                    <span>
                      Showing {Math.min((safePage - 1) * pageSize + 1, consultants.length)}-{Math.min(safePage * pageSize, consultants.length)} of {consultants.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={goToPreviousConsultantPage}
                        disabled={safePage === 1}
                        className="rounded border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <span>Page {safePage} / {totalPages}</span>
                      <button
                        type="button"
                        onClick={goToNextConsultantPage}
                        disabled={safePage >= totalPages}
                        className="rounded border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {(section === "Overview" || section === "Teams") && (
        <section className="rounded-md bg-white p-2 shadow">
          <div className="mb-2 flex items-center justify-between px-2">
            <h2 className="text-sm font-semibold text-gray-600">Team assignments</h2>
            <span className="text-[11px] text-gray-500">{teams.length} total teams</span>
          </div>

          {loading ? (
            <p className="border-t p-6 text-center text-sm text-gray-500">Loading teams...</p>
          ) : teams.length === 0 ? (
            <p className="border-t p-6 text-center text-sm text-gray-500">No teams yet. Create your first team above.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
              {teams.map((team) => (
                <article key={team.id} className="rounded-md border border-gray-200 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">{team.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">Lead: {team.teamLeadName}</p>
                      <p className="mt-1 text-xs text-gray-500">Recruiters: {team.recruiterNames?.join(", ") || "None"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openTeamEditor(team)}
                        aria-label={`Edit ${team.name}`}
                        title="Edit team"
                        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-700"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <span className="rounded bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700">
                        {team.consultants?.length ?? 0} consultants
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
                    {(team.consultants ?? []).map((consultant) => (
                      <li key={consultant.userId} className="py-2 text-xs text-gray-700">
                        <span className="font-medium">{consultant.name}</span>
                        {consultant.email && <span className="ml-2 text-gray-500">{consultant.email}</span>}
                      </li>
                    ))}
                    {team.consultants?.length === 0 && <li className="py-3 text-xs text-gray-500">No consultants assigned yet.</li>}
                  </ul>

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                    <TeamMemberSearchSelect
                      team={team}
                      members={assignableConsultants.filter(
                        (consultant) => !(team.consultants ?? []).some((member) => member.userId === consultant.userId)
                      )}
                      value={consultantByTeam[team.id] ?? ""}
                      memberType="consultant"
                      onChange={(consultantUserId) => setConsultantByTeam((current) => ({
                        ...current,
                        [team.id]: consultantUserId,
                      }))}
                    />
                    <button type="button" disabled={saving || !consultantByTeam[team.id]} onClick={() => assignConsultant(team.id)} className="rounded bg-gray-800 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
                      Assign
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <TeamMemberSearchSelect
                      team={team}
                      members={recruiters.filter(
                        (recruiter) => !(team.recruiterUserIds ?? []).includes(recruiter.userId)
                      )}
                      value={recruiterByTeam[team.id] ?? ""}
                      memberType="recruiter"
                      onChange={(recruiterUserId) => setRecruiterByTeam((current) => ({
                        ...current,
                        [team.id]: recruiterUserId,
                      }))}
                    />
                    <button type="button" disabled={saving || !recruiterByTeam[team.id]} onClick={() => addRecruiter(team.id)} className="rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                      Add recruiter
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {editingTeam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setEditingTeam(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-team-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-white shadow-xl"
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="edit-team-title" className="font-semibold text-gray-900">Edit team</h2>
                <p className="mt-1 text-xs text-gray-500">Update team details and membership.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTeam(null)}
                disabled={saving}
                aria-label="Close editor"
                className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={updateTeam} className="space-y-4 p-5">
              {actionError && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
              <label className="block text-sm text-gray-700">
                Team name
                <input
                  required
                  value={editTeamForm.name}
                  onChange={(event) => setEditTeamForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                />
              </label>

              <label className="block text-sm text-gray-700">
                Team Lead
                <select
                  required
                  value={editTeamForm.teamLeadUserId}
                  onChange={(event) => setEditTeamForm((current) => ({ ...current, teamLeadUserId: event.target.value }))}
                  className="mt-1 w-full rounded border border-gray-300 bg-white p-2"
                >
                  {editTeamLeads.map((member) => (
                    <option key={member.userId} value={member.userId}>{member.name}</option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend className="text-sm font-medium text-gray-700">Recruiters</legend>
                <div className="mt-1 max-h-40 space-y-1 overflow-y-auto rounded border border-gray-200 p-2">
                  {editTeamRecruiters.length === 0 ? (
                    <p className="text-xs text-gray-500">No eligible recruiters available.</p>
                  ) : editTeamRecruiters.map((recruiter) => (
                    <label key={recruiter.userId} className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editTeamForm.recruiterUserIds.includes(recruiter.userId)}
                        onChange={() => toggleEditListItem("recruiterUserIds", recruiter.userId)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span>{recruiter.name}</span>
                      {recruiter.email && <span className="ml-auto text-xs text-gray-500">{recruiter.email}</span>}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium text-gray-700">Consultants</legend>
                <p className="mt-1 text-xs text-gray-500">Removing a consultant here only removes them from this team.</p>
                <div className="mt-1 max-h-48 space-y-1 overflow-y-auto rounded border border-gray-200 p-2">
                  {(editingTeam.consultants ?? []).length === 0 ? (
                    <p className="text-xs text-gray-500">No consultants are assigned to this team.</p>
                  ) : editingTeam.consultants.map((consultant) => (
                    <label key={consultant.userId} className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editTeamForm.consultantUserIdsToRemove.includes(consultant.userId)}
                        onChange={() => toggleEditListItem("consultantUserIdsToRemove", consultant.userId)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span>Remove {consultant.name}</span>
                      {consultant.email && <span className="ml-auto text-xs text-gray-500">{consultant.email}</span>}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  disabled={saving}
                  className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !editTeamForm.teamLeadUserId}
                  className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
