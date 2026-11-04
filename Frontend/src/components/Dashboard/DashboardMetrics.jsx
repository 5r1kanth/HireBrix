export default function DashboardMetrics({ roleCounts, activeRole, onRoleSelect }) {
  return (
    <div className="grid w-full grid-cols-2 items-center gap-2 my-4 sm:grid-cols-4 lg:grid-cols-8">
      {Object.entries(roleCounts).map(([role, count]) => {
        const isDeleted = role === "Deleted";
        const isActive = role === "Active";
        const isSelected = activeRole === role;

        let cardClass = "min-w-0 cursor-pointer rounded-md border px-2 py-4 text-center shadow transition";

        if (isSelected) {
          cardClass += isDeleted ? " bg-red-100 border-red-500 ring-2 ring-red-500" : " bg-green-100 border-green-600 ring-2 ring-green-600";
        } else {
          cardClass += " bg-white border-transparent hover:shadow-md";
        }

        const textColor = isDeleted ? "text-red-600" : isActive ? "text-green-600" : "text-gray-600";

        return (
          <div key={role} onClick={() => onRoleSelect(role)} className={cardClass}>
            <div className={`break-words text-xs font-semibold ${textColor}`}>{role}</div>
            <div className="mt-1 text-xl font-bold">{count}</div>
          </div>
        );
      })}
    </div>
  );
}
