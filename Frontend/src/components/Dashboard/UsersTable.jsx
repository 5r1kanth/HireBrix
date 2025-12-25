import { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon, CheckIcon, XMarkIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { rowHeight } from "@/data/adminData";

const ROLE_OPTIONS = ["Admin", "Manager", "Team Lead", "Recruiter", "Consultant"];
const STATUS_OPTIONS = ["Active", "Inactive"];

export default function UsersTable({ title, columns, data = [], itemsPerPage = 10, onSave, onDelete, onRestore, showDeleted = false, activeRole = null, loading = false }) {
  const [page, setPage] = useState(1);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
     FILTERING (FIXED)
  ========================= */
  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const matchDeleted = showDeleted ? u.deleted : !u.deleted;
      const matchRole = activeRole ? u.role === activeRole : true;
      const matchSearch = !searchTerm || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase());

      return matchDeleted && matchRole && matchSearch;
    });
  }, [data, showDeleted, activeRole, searchTerm]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (page > totalPages) setPage(1);

  const emptyRows = Math.max(0, itemsPerPage - paginatedData.length);

  /* =========================
     ACTION HANDLERS
  ========================= */
  const handleEditClick = (row) => {
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

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete?.(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (start === 1) {
      end = 5;
    } else if (end === totalPages) {
      start = totalPages - 4;
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="bg-white rounded-md shadow p-2 flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="border rounded px-2 py-1 text-sm w-60 bg-gray-50"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
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
            {paginatedData.length ? (
              paginatedData.map((row) => (
                <tr key={row.id} className={`border-t ${editingRowId === row.id ? "bg-gray-50" : "hover:bg-blue-50"}`} style={{ height: rowHeight }}>
                  {columns.map((col) =>
                    editingRowId === row.id ? (
                      col.accessor === "role" ? (
                        <td key={col.accessor} className="p-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                          <select value={editData.role} onChange={(e) => handleChange(e, "role")} className="w-full p-1 border rounded text-center bg-white">
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                      ) : col.accessor === "status" ? (
                        <td key={col.accessor} className="p-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                          <select value={editData.status} onChange={(e) => handleChange(e, "status")} className="w-full p-1 border rounded text-center bg-white">
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      ) : (
                        <td key={col.accessor} className="p-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                          <input value={editData[col.accessor] || ""} onChange={(e) => handleChange(e, col.accessor)} className="w-full p-1 border rounded text-center bg-white" />
                        </td>
                      )
                    ) : (
                      <td key={col.accessor} className="p-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                        {row[col.accessor] || "-"}
                      </td>
                    )
                  )}

                  <td className="p-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                    {editingRowId === row.id ? (
                      <div className="flex justify-center">
                        <div className="">
                          <CheckIcon
                            onClick={handleSave}
                            className="w-5 h-5 p-0.5 border-2 border-green-500 rounded-full hover:bg-green-500 hover:text-white inline cursor-pointer text-green-600"
                          />
                        </div>
                        <div className="">
                          <XMarkIcon
                            onClick={handleCancel}
                            className="w-5 h-5 p-0.5 border-2 border-red-500 rounded-full hover:bg-red-500 hover:text-white inline ml-2 cursor-pointer text-red-600"
                          />
                        </div>
                      </div>
                    ) : showDeleted ? (
                      <div className="flex justify-center">
                        <ArrowPathIcon onClick={() => onRestore?.(row)} className="w-5 h-5 cursor-pointer text-green-600" />
                      </div>
                    ) : (
                      <>
                        <PencilSquareIcon onClick={() => handleEditClick(row)} className="w-5 h-5 inline cursor-pointer text-blue-600" />
                        <TrashIcon onClick={() => setDeleteTarget(row)} className="w-5 h-5 inline ml-2 cursor-pointer text-red-600" />
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{ height: rowHeight }}>
                <td colSpan={columns.length + 1} className="text-center text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
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

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-3 select-none">
        {/* Left Arrow */}
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 disabled:opacity-40">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        {visiblePages.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`w-8 h-8 text-xs border rounded flex items-center justify-center
        ${num === page ? "bg-gray-600 text-white" : "hover:bg-gray-200"}
      `}>
            {num}
          </button>
        ))}

        {/* Right Arrow */}
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 disabled:opacity-40">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          {" "}
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
            {" "}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>{" "}
            <p className="text-sm text-gray-600 mb-4">
              {" "}
              Are you sure you want to delete{" "}
              <strong>
                {" "}
                {deleteTarget.firstName} {deleteTarget.lastName}{" "}
              </strong>{" "}
              ?{" "}
            </p>{" "}
            <div className="flex justify-end gap-3">
              {" "}
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border rounded hover:bg-gray-100">
                {" "}
                Cancel{" "}
              </button>{" "}
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                {" "}
                Delete{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}
    </div>
  );
}
