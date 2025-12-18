import React, { useState, useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.getElementById("hero")?.offsetHeight || 0;
      setVisible(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 flex flex-col items-center group 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"} 
        transition-all duration-300`}
    >
      {/* Tooltip */}
      <span
        className="mb-2 px-2 py-1 text-xs text-white electric-blue rounded-md shadow-lg opacity-0 
                   group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300"
      >
        To Top
      </span>

      {/* Button */}
      <button
        onClick={scrollToTop}
        className="p-2 rounded-full shadow-lg cursor-pointer bg-gradient-to-tr 
                   from-[var(--electric-blue)] to-[var(--hiring-lime)] text-white"
        aria-label="Back to top"
      >
        <ChevronUpIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
