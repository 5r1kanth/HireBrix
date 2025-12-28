export default function DashboardMetrics({ roleCounts, activeRole, onRoleSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-4 my-2">
      {Object.entries(roleCounts).map(([role, count]) => {
        const isDeleted = role === "Deleted";
        const isActive = role === "Active";
        const isSelected = activeRole === role;

        let cardClass = "cursor-pointer rounded-md shadow p-4 text-center transition border";

        if (isSelected) {
          cardClass += isDeleted ? " bg-red-100 border-red-500 ring-2 ring-red-500" : " bg-green-100 border-green-600 ring-2 ring-green-600";
        } else {
          cardClass += " bg-white border-transparent hover:shadow-md";
        }

        const textColor = isDeleted ? "text-red-600" : isActive ? "text-green-600" : "text-gray-600";

        return (
          <div key={role} onClick={() => onRoleSelect(role)} className={cardClass}>
            <div className={`text-sm font-semibold ${textColor}`}>{role}</div>
            <div className="text-2xl font-bold mt-1">{count}</div>
          </div>
        );
      })}
    </div>
  );
}
