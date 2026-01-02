import { useEffect } from "react";

export default function Toast({
  message,
  type = "success", // "success" | "error"
  show,
  duration = 4000,
  onClose,
}) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-sm font-medium
        transition-all duration-500 ease-in-out
        ${type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
        ${show ? "translate-x-0 opacity-100" : "translate-x-40 opacity-0"}
      `}>
      {message}
    </div>
  );
}
