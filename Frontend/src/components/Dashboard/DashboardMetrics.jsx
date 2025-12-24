export default function DashboardMetrics({ roleCounts, activeRole, onRoleSelect, deletedCount }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-4 my-2">
      {Object.entries(roleCounts).map(([role, count]) => {
        // Determine card classes
        let cardClass = "cursor-pointer rounded-md shadow p-4 text-center transition border";

        if (activeRole === role) {
          // Active card selected
          if (role === "Deleted") {
            cardClass += " bg-red-100 border-red-500 ring-2 ring-red-500";
          } else {
            cardClass += " border-[var(--hiring-lime)] ring-2 ring-[var(--hiring-lime)]";
          }
        } else {
          // Not selected
          cardClass += " bg-white border-transparent hover:shadow-md";
        }

        const textColor = role === "Deleted" ? "text-red-500" : role === "Active" ? "text-green-500" : "text-gray-500";

        return (
          <div key={role} onClick={() => onRoleSelect(activeRole === role ? null : role)} className={cardClass}>
            <div className={`text-sm font-semibold ${textColor}`}>{role}</div>
            <div className="text-2xl font-bold mt-1">{count}</div>
          </div>
        );
      })}
    </div>
  );
}
