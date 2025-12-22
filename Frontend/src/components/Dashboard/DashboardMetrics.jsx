export default function DashboardMetrics({ roleCounts, activeRole, onRoleSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 my-10">
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
    </div>
  );
}
