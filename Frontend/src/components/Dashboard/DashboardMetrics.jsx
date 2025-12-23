export default function DashboardMetrics({ roleCounts, activeRole, onRoleSelect, deletedCount }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-4 my-4">
      {Object.entries(roleCounts).map(([role, count]) => (
        <div
          key={role}
          onClick={() => onRoleSelect(activeRole === role ? null : role)}
          className={`cursor-pointer rounded-md bg-white shadow p-4 text-center transition border
            ${activeRole === role ? "border-[var(--hiring-lime)] ring-2 ring-[var(--hiring-lime)]" : "border-transparent hover:shadow-md"}`}>
          <div className="text-gray-500 text-sm font-semibold">{role}</div>
          <div className="text-2xl font-bold mt-1">{count}</div>
        </div>
      ))}

      {/* Deleted Users Card
      <div
        onClick={() => onRoleSelect("Deleted")}
        className={`cursor-pointer rounded-md bg-red-100 shadow p-4 text-center transition border
          ${activeRole === "Deleted" ? "border-red-500 ring-2 ring-red-500" : "border-transparent hover:shadow-md"}`}>
        <div className="text-red-500 text-sm font-semibold">Deleted Users</div>
        <div className="text-2xl font-bold mt-1">{deletedCount}</div>
      </div> */}
    </div>
  );
}
