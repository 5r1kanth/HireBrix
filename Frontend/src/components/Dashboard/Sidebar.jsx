import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Sidebar({
  header,
  user,
  contents,
  footer,
  collapsed,
  onMenuClick,
}) {
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleClick = (item) => {
    setActiveItem(item.name);
    onMenuClick?.(item);
  };

  return (
    <aside
      className={`flex flex-col h-[calc(100vh-16px)] bg-white border-r border-gray-300 shadow-md transition-all duration-300 rounded-md ${
        collapsed ? "w-16" : "w-1/6"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 transition shrink-0 shadow-sm ${
          collapsed && "justify-center"
        }`}
      >
        <img src={header.logo} alt="logo" className="w-8 h-8" />
        {!collapsed && (
          <div>
            <p className="font-semibold text-gray-900">{header.title}</p>
            <p className="text-xs text-gray-500">{header.subtitle}</p>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <nav className="flex-1 p-2 overflow-y-auto text-sm">
        {/* User info */}
        {user && (
          <div
            className={`flex items-center gap-3 p-2 cursor-pointer rounded-md hover:bg-gray-100 transition ${
              collapsed && "justify-center"
            }`}
            onClick={() => {
              setActiveItem(null);
              if (collapsed) {onMenuClick?.({ name: null });}
               // Reset to show all sections
            }}
          >
            <img
              src={user.photo}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
            {!collapsed && (
              <span className="font-medium text-gray-700">{user.name}</span>
            )}
          </div>
        )}

        {/* Menu items */}
        {contents.map((item) => (
          <div key={item.name} className="mb-1">
            {item.submenu ? (
              <>
                <button
                  onClick={() => {
                    if (collapsed) handleClick(item);
                    else toggleDropdown(item.name);
                  }}
                  className={`flex items-center gap-2 w-full p-2 rounded-md text-gray-700 hover:bg-gray-100 transition ${
                    collapsed && "justify-center"
                  } ${
                    activeItem === item.name ? "bg-gray-300 font-semibold" : ""
                  }`}
                >
                  {!collapsed && (
                    <ChevronRightIcon
                      className={`w-4 h-4 transition-transform duration-300 opacity-40 ${
                        openDropdowns.includes(item.name) ? "rotate-90" : ""
                      }`}
                    />
                  )}
                  <item.icon className="w-4 h-4" />
                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </button>

                {!collapsed && (
                  <div
                    className={`pl-12 overflow-hidden transition-all duration-300 ease-in-out ${
                      openDropdowns.includes(item.name)
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => handleClick(sub)}
                        className={`block w-full text-left p-1 rounded-md text-gray-600 hover:bg-gray-100 transition ${
                          activeItem === sub.name
                            ? "bg-gray-200 font-semibold"
                            : ""
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => {if (collapsed) {handleClick(item)}}}
                className={`flex items-center gap-2 w-full p-2 rounded-md text-gray-700 hover:bg-gray-100 transition ${
                  collapsed && "justify-center"
                } ${
                  activeItem === item.name ? "bg-gray-300 font-semibold" : ""
                }`}
              >
                {!collapsed && (
                  <ChevronRightIcon className="w-4 h-4 opacity-40" />
                )}
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
            onClick={() => (collapsed ? onMenuClick?.(item) : item.onClick?.())}
            className={`flex items-center gap-3 w-full p-2 rounded-md text-gray-700 hover:bg-gray-100 transition ${
              collapsed && "justify-center"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {!collapsed && <span className="font-medium">{item.name}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
