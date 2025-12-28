import { useEffect, useState } from "react";

export default function DesktopGuard({ children }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => setIsDesktop(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient px-6 text-center">
        <div className="max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h1 className="text-xl font-semibold text-almost-black mb-3">Desktop Required</h1>
          <p className="text-sm text-gray-700">
            <b>Mobile experience coming soon 🚧</b>
            <br />
            Please access HireBrix on a desktop or laptop.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
