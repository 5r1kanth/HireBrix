import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Sidebar({ header, user, contents, footer, collapsed, onMenuClick, onSelect }) {
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  const toggleDropdown = (name) => setOpenDropdowns((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const handleClick = (item) => {
    if (collapsed) {
      onMenuClick?.();
      return;
    }
    setActiveItem(item.name);
    onSelect?.(item);
  };

  const handleLogout = () => {
    // Clear all user session info
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <aside className={`flex flex-col h-[calc(100vh-16px)] bg-white border-r border-gray-300 shadow-md transition-all duration-300 rounded-md ${collapsed ? "w-16" : "w-1/6"}`}>
      {/* Logo / Header */}
      <div
        className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 transition shrink-0 shadow-sm ${collapsed && "justify-center"}`}
        onClick={() => {
          setActiveItem(null);
          onSelect?.(null);
        }}>
        <img src={header.logo} alt="logo" className="w-8 h-8" />
        {!collapsed && (
          <div className="text-left">
            <div className="text-xl font-extrabold uppercase bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">HireBrix</div>
            <div className="text-md tracking-wide font-bold -mt-2">
              Track <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">&</span> Hire
            </div>
          </div>
        )}
      </div>

      {/* User Info */}
      <nav className="flex-1 p-2 overflow-y-auto text-sm">
        {user && (
          <div
            className={`flex items-center gap-3 p-2 cursor-pointer rounded-md hover:bg-gray-100 transition ${collapsed && "justify-center"}`}
            onClick={() => {
              setActiveItem(null);
              onSelect?.(null);
            }}>
            <img src={user.picture} alt={user.fullName} className="w-8 h-8 rounded-full" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">{user.fullName}</span>
                <span className="font-small text-xs text-gray-400">{user.role}</span>
              </div>
            )}
          </div>
        )}

        {/* Menu Items */}
        {contents.map((item) => (
          <div key={item.name} className="mb-1">
            {item.submenu ? (
              <>
                <button
                  onClick={() => (collapsed ? handleClick(item) : toggleDropdown(item.name))}
                  className={`flex items-center gap-2 w-full p-2 rounded-md text-gray-700 hover:bg-gray-100 transition ${collapsed && "justify-center"} ${
                    activeItem === item.name ? "bg-gray-300 font-semibold" : ""
                  }`}>
                  {!collapsed && <ChevronRightIcon className={`w-4 h-4 transition-transform duration-300 opacity-40 ${openDropdowns.includes(item.name) ? "rotate-90" : ""}`} />}
                  <item.icon className="w-4 h-4" />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </button>

                {!collapsed && (
                  <div
                    className={`pl-12 overflow-hidden transition-all duration-300 ease-in-out ${openDropdowns.includes(item.name) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => handleClick(sub)}
                        className={`block w-full text-left p-1 rounded-md text-gray-600 hover:bg-gray-100 transition ${
                          activeItem === sub.name ? "bg-gray-200 font-semibold" : ""
                        }`}>
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => handleClick(item)}
                className={`flex items-center gap-2 w-full p-2 rounded-md text-gray-700 hover:bg-gray-100 transition ${collapsed && "justify-center"} ${
                  activeItem === item.name ? "bg-gray-300 font-semibold" : ""
                }`}>
                {!collapsed && <ChevronRightIcon className="w-4 h-4 opacity-40" />}
                <item.icon className="w-4 h-4" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 shrink-0 text-sm">
        {footer.map((item) => (
          <button
            key={item.name}
            onClick={item.name === "Logout" ? handleLogout : item.onClick}
            className={`flex items-center gap-3 w-full p-2 rounded-md  ${item.name === "Logout" ? "text-red-500" : "text-gray-700"} hover:bg-gray-100 transition ${
              collapsed && "justify-center"
            }`}>
            <item.icon className="w-4 h-4" />
            {!collapsed && <span className="font-medium">{item.name}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
