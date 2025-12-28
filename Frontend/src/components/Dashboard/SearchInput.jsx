import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function SearchInput({ placeholder = "Search...", onSearch }) {
  const [value, setValue] = useState("");

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch?.(value);
    }, 300);

    return () => clearTimeout(delay);
  }, [value, onSearch]);

  const clearSearch = () => {
    setValue("");
    onSearch?.("");
  };

  return (
    <div className="relative w-60">
      <input
        name="User Search"
        type="text"
        className="border rounded pr-8 pl-2 py-1 text-sm w-full bg-gray-50"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value && (
        <button
          onClick={clearSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-red-500 hover:bg-white text-white bg-red-500 border border-red-500 rounded-full text-red-500"
          aria-label="Clear search">
          <XMarkIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
