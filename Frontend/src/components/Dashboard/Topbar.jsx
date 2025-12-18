import {
  Squares2X2Icon,
  BellIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "../Theme/ThemeToggle";

export default function Topbar({ title, onMenuClick, user }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-200 shrink-0 rounded-md shadow-sm">
      {/* Left: Sidebar toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-md hover:bg-gray-100 transition"
        >
          <Squares2X2Icon className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <div>
        <h1 className="text-lg font-semibold text-gray-900 captalize">{title}</h1>
      </div>
      {/* Right: Notification + User */}
      <div className="flex items-center gap-2 relative">
        {/* Notification */}
        <button className="p-1.5 rounded-md hover:bg-gray-100 transition relative">
          <BellIcon className="w-5 h-5 text-gray-600" />
          {/* Example: notification badge */}
          {user.hasNotifications && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100 transition"
          >
            <img
              src={user.photo}
              alt={user.name}
              className="w-7 h-7 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user.name}
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 rounded-md shadow-md text-sm z-50 overflow-hidden">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 transition">
                Profile
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 transition">
                Settings
              </button>
              <button
                onClick={user.onLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
