import { createContext, useContext, useState, useCallback } from "react";
import Toast from "@/components/ui/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  }, []);

  const hideToast = () => {
    setToast((t) => ({ ...t, show: false }));
  };

  const value = {
    success: (msg) => showToast(msg, "success"),
    error: (msg) => showToast(msg, "error"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Global Toast */}
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
};
