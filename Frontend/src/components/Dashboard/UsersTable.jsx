import { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon, CheckIcon, XMarkIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { rowHeight, actionColumnWidth } from "@/data/adminData";

const ROLE_OPTIONS = ["Admin", "Manager", "Team Lead", "Recruiter", "Consultant"];
const STATUS_OPTIONS = ["Active", "Inactive"];

export default function UsersTable({ title, columns, data = [], itemsPerPage = 10, onSave, onDelete, onRestore, showDeleted = false }) {
  const [page, setPage] = useState(1);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return Array.isArray(data) ? data.slice(start, start + itemsPerPage) : [];
  }, [data, page, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil((data?.length || 0) / itemsPerPage));
  if (page > totalPages) setPage(1);

  const emptyRows = Math.max(0, itemsPerPage - paginatedData.length);

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

  return (
    <div className="bg-white rounded-md shadow p-2 flex flex-col relative">
      <h2 className="text-sm font-semibold text-gray-600 px-2 mb-2">{title}</h2>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-blue-100 text-gray-600" style={{ height: rowHeight }}>
              {columns.map((col) => (
                <th key={col.accessor} className="p-2 text-center w-2/13">
                  {col.label}
                </th>
              ))}
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`border-t transition ${editingRowId === row.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
                  style={{ height: "40px" }} // <-- fixed row height
                >
                  {columns.map((col) =>
                    editingRowId === row.id ? (
                      col.accessor === "role" ? (
                        <td key={col.accessor} className="p-2 text-center">
                          <select value={editData.role} onChange={(e) => handleChange(e, "role")} className="w-full p-1 border rounded bg-white">
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </td>
                      ) : col.accessor === "status" ? (
                        <td key={col.accessor} className="p-2 text-center">
                          <select value={editData.status} onChange={(e) => handleChange(e, "status")} className="w-full p-1 border rounded bg-white">
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      ) : (
                        <td key={col.accessor} className="p-2 text-center">
                          <input
                            type="text"
                            value={editData[col.accessor] || ""}
                            onChange={(e) => handleChange(e, col.accessor)}
                            className="w-full p-1 border rounded text-center bg-white"
                          />
                        </td>
                      )
                    ) : (
                      <td key={col.accessor} className="p-2 text-center w-2/13">
                        {row[col.accessor] || "-"}
                      </td>
                    )
                  )}

                  <td className="p-2 text-center w-2/13">
                    {editingRowId === row.id ? (
                      <div className="flex justify-center gap-2">
                        <button onClick={handleSave} className="text-green-400 hover:text-white hover:bg-green-400 rounded-full">
                          <CheckIcon className="w-6 h-6 p-1 border-2 border-green-500 rounded-full" />
                        </button>
                        <button onClick={handleCancel} className="text-red-400 hover:text-white hover:bg-red-400 rounded-full">
                          <XMarkIcon className="w-6 h-6 p-1 border-2 border-red-500 rounded-full" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        {!showDeleted && (
                          <button onClick={() => handleEditClick(row)} className="text-blue-500 hover:text-blue-700">
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        )}
                        {!showDeleted ? (
                          <button onClick={() => setDeleteTarget(row)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <button onClick={() => onRestore?.(row)} className="text-green-500 hover:text-green-700">
                            <ArrowPathIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{ height: "40px" }}>
                {" "}
                {/* <-- empty row same height */}
                <td colSpan={columns.length + 1} className="p-2 text-center text-gray-400 w-2/13">
                  No records found
                </td>
              </tr>
            )}

            {emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, idx) => (
                <tr key={`empty-${idx}`} style={{ height: "40px" }}>
                  {" "}
                  {/* <-- same height */}
                  {columns.map((col) => (
                    <td key={col.accessor}>&nbsp;</td>
                  ))}
                  <td>&nbsp;</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button key={num} onClick={() => setPage(num)} className={`px-3 py-1 rounded ${num === page ? "bg-gray-500 text-white" : ""}`}>
            {num}
          </button>
        ))}
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.firstName} {deleteTarget.lastName}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border rounded hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
