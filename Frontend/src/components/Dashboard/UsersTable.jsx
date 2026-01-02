import { useState, useMemo, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon, CheckIcon, XMarkIcon, TrashIcon, ArrowPathIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { rowHeight } from "@/data/adminData";
import SearchInput from "./SearchInput";
import { useAuth } from "@/context/AuthContext";

export default function UsersTable({
  title,
  columns,
  data = [],
  itemsPerPage = 10,
  onSave,
  onDelete,
  onRestore,
  onResendInvite,
  showDeleted = false,
  activeRole = null,
  loading = false,
}) {
  const [page, setPage] = useState(1);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null); // <-- New state for restore confirmation
  const [searchTerm, setSearchTerm] = useState("");
  const [resendTarget, setResendTarget] = useState(null);

  const { companyConfig, loading: authLoading } = useAuth();

  const ROLE_OPTIONS = companyConfig?.roles || ["Admin", "Manager", "Team Lead", "Recruiter", "Consultant"];
  const STATUS_OPTIONS = companyConfig?.userStatuses || ["Active", "Inactive"];

  // -------------------------
  // FILTERED DATA
  // -------------------------
  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const matchDeleted = showDeleted ? u.deleted : !u.deleted;
      const matchRole = activeRole ? u.role === activeRole : true;
      const matchSearch = !searchTerm || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase());

      return matchDeleted && matchRole && matchSearch;
    });
  }, [data, showDeleted, activeRole, searchTerm]);

  // -------------------------
  // PAGINATION
  // -------------------------
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [showDeleted, activeRole, searchTerm]);

  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const emptyRows = Math.max(0, itemsPerPage - paginatedData.length);

  // -------------------------
  // ACTION HANDLERS
  // -------------------------
  const handleEditClick = (row) => {
    if (authLoading) return;
    setEditingRowId(row.id);
    setEditData({ ...row });
  };

  const handleChange = (e, accessor) => {
    setEditData((prev) => ({ ...prev, [accessor]: e.target.value }));
  };

  const handleSave = () => {
    onSave?.(editData);
    setEditingRowId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditData({});
  };

  const confirmDelete = async () => {
    await onDelete?.(deleteTarget);
    setDeleteTarget(null);
  };

  const confirmRestore = async () => {
    await onRestore?.(restoreTarget);
    setRestoreTarget(null);
  };

  const confirmResend = async () => {
    await onResendInvite?.(resendTarget.id);
    setResendTarget(null);
  };

  // const setUpMessage = (result) => {
  //   if (result.success) {
  //     setMessage({ type: "success", text: result.message });
  //   } else {
  //     setMessage({ type: "error", text: result.message });
  //   }
  // };

  // const cardTimeOut = () => {
  //   setShowToast(true);
  //   setTimeout(() => setMessage(null), 6500);
  //   setTimeout(() => setShowToast(false), 4000);
  // };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-[10px] font-semibold";
    const map = {
      Active: "bg-green-100 text-green-700",
      Inactive: "bg-red-100 text-red-700",
      Expired: "bg-purple-100 text-purple-700",
      Invited: "bg-blue-100 text-blue-700",
    };
    return <span className={`${base} ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
  };

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    if (start === 1) end = 5;
    else if (end === totalPages) start = totalPages - 4;
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  const visiblePages = getVisiblePages();

  return (
    <div className="bg-white rounded-md shadow p-2 flex flex-col relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
        <SearchInput placeholder="Search users..." onSearch={(v) => setSearchTerm(v)} />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto flex-1 border border-gray-200 rounded-sm">
        <table className="w-full text-xs border-collapse table-fixed">
          <thead>
            <tr className="bg-blue-100 text-gray-600" style={{ height: rowHeight }}>
              {columns.map((col) => (
                <th key={col.accessor} className="p-2 text-center">
                  {col.label}
                </th>
              ))}
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.id} className={`border-t ${editingRowId === row.id ? "bg-gray-50" : "hover:bg-blue-50"}`} style={{ height: rowHeight }}>
                  {columns.map((col) =>
                    editingRowId === row.id ? (
                      col.accessor === "role" ? (
                        <td key={col.accessor} className="p-2 text-center">
                          <select value={editData.role} onChange={(e) => handleChange(e, "role")} disabled={authLoading} className="w-full p-1 border rounded text-center bg-white">
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                      ) : col.accessor === "status" ? (
                        <td key={col.accessor} className="p-2 text-center">
                          <select
                            value={editData.status}
                            onChange={(e) => handleChange(e, "status")}
                            disabled={authLoading}
                            className="w-full p-1 border rounded text-center bg-white">
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      ) : (
                        <td key={col.accessor} className="p-2 text-center">
                          <input
                            value={editData[col.accessor] || ""}
                            onChange={(e) => handleChange(e, col.accessor)}
                            disabled={authLoading}
                            className="w-full p-1 border rounded text-center bg-white"
                          />
                        </td>
                      )
                    ) : (
                      <td key={col.accessor} className="p-2 text-center">
                        {col.accessor === "status" ? getStatusBadge(row.status) : row[col.accessor] || "-"}
                      </td>
                    )
                  )}

                  <td className="p-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                    {editingRowId === row.id ? (
                      <div className="flex justify-center">
                        <CheckIcon
                          onClick={handleSave}
                          className="w-5 h-5 p-0.5 border-2 border-green-500 rounded-full hover:bg-green-500 hover:text-white inline cursor-pointer text-green-600"
                        />
                        <XMarkIcon
                          onClick={handleCancel}
                          className="w-5 h-5 p-0.5 border-2 border-red-500 rounded-full hover:bg-red-500 hover:text-white inline ml-2 cursor-pointer text-red-600"
                        />
                      </div>
                    ) : showDeleted ? (
                      <div className="flex justify-center">
                        <ArrowPathIcon onClick={() => setRestoreTarget(row)} className="w-5 h-5 cursor-pointer text-green-600" title="Restore" />
                        <EnvelopeIcon onClick={() => setResendTarget(row)} className="w-5 h-5 ml-2 cursor-pointer text-blue-500" />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <PencilSquareIcon onClick={() => handleEditClick(row)} className="w-5 h-5 cursor-pointer text-blue-600" title="Edit" />
                        <TrashIcon onClick={() => setDeleteTarget(row)} className="w-5 h-5 ml-2 cursor-pointer text-red-600" title="Delete" />
                        <EnvelopeIcon onClick={() => setResendTarget(row)} className="w-5 h-5 ml-2 cursor-pointer text-blue-500" title="Re-invite" />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{ height: rowHeight }}>
                <td colSpan={columns.length + 1} className="text-center text-gray-400">
                  {loading ? "Loading..." : "No records found"}
                </td>
              </tr>
            )}

            {Array.from({ length: emptyRows }).map((_, i) => (
              <tr key={i} style={{ height: rowHeight }}>
                <td colSpan={columns.length + 1}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        {getVisiblePages().map((n) => (
          <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 border rounded ${n === page ? "bg-gray-700 text-white" : "hover:bg-gray-100"}`}>
            {n}
          </button>
        ))}
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.firstName} {deleteTarget.lastName}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTORE MODAL */}
      {restoreTarget && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setRestoreTarget(null)}>
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Restore</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to restore{" "}
              <strong>
                {restoreTarget.firstName} {restoreTarget.lastName}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRestoreTarget(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={confirmRestore} className="px-4 py-2 bg-green-600 text-white rounded">
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESEND INVITE MODAL */}
      {resendTarget && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setResendTarget(null)}>
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Resend Invite</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to resend invite to{" "}
              <strong>
                {resendTarget.firstName} {resendTarget.lastName}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setResendTarget(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={confirmResend} className="px-4 py-2 bg-blue-600 text-white rounded">
                Resend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
