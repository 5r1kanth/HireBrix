const getName = (user) =>
  user?.fullName ||
  user?.name ||
  [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ") ||
  "User";

export default function ProfileDetails({ user }) {
  const name = getName(user);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const details = [
    ["Email", user?.email],
    ["Role", user?.role],
    ["Department", user?.department],
    ["Status", user?.status],
  ].filter(([, value]) => value);

  return (
    <section className="w-full min-h-full bg-white rounded-md shadow p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile</h2>

      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        {user?.picture || user?.photo ? (
          <img
            src={user.picture || user.photo}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 break-words">{name}</h3>
          {user?.email && <p className="text-sm text-gray-500 break-all">{user.email}</p>}
        </div>
      </div>

      {details.length > 0 ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mt-2">
          {details.map(([label, value]) => (
            <div key={label} className="py-4 border-b border-gray-100">
              <dt className="text-xs font-medium uppercase text-gray-500">{label}</dt>
              <dd className="mt-1 text-sm text-gray-800 break-words">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-6 text-sm text-gray-500">No additional profile details are available.</p>
      )}
    </section>
  );
}