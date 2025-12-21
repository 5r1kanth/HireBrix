import { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function UsersTable({ title, columns, data = [], itemsPerPage = 10 }) {
  const [page, setPage] = useState(1);

  /* =========================
     PAGINATION LOGIC
  ========================= */
  // Always at least 1 page
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, page, itemsPerPage]);

  // Reset page if it exceeds totalPages
  if (page > totalPages) setPage(1);

  // Empty rows to keep table height fixed
  const emptyRows = itemsPerPage - paginatedData.length > 0 ? itemsPerPage - paginatedData.length : 0;

  return (
    <div className="bg-white rounded-md shadow p-2 flex flex-col">
      {/* Title */}
      <h2 className="text-sm font-semibold text-gray-600 px-2 mb-2">{title}</h2>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-blue-100 text-gray-600 text-left">
              {columns.map((col) => (
                <th key={col.accessor} className="p-2 text-center">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Actual Data */}
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="border-t text-gray-600 hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td key={col.accessor} className="p-2 text-center">
                    {Array.isArray(row[col.accessor]) ? row[col.accessor].join(", ") : row[col.accessor] || "-"}
                  </td>
                ))}
              </tr>
            ))}

            {/* Empty Placeholder Rows */}
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <tr key={`empty-${idx}`} className="border-t">
                {columns.map((col) => (
                  <td key={col.accessor} className="p-2 text-center">
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}

            {/* No Data */}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-400">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - always show at least 1 */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded text-sm transition ${num === page ? "bg-gray-500 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
              {num}
            </button>
          ))}
        </div>

        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
