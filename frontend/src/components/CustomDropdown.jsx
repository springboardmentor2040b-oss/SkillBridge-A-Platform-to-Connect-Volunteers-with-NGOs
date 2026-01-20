import React, { useState , useRef, useEffect } from "react";



const CustomDropdown = ({
  options = [],
  selectedValues = [],
  onSelect,
  placeholder = "Select or type",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEscape);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
  };
}, []);

  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedValues.includes(opt)
  );

  const handleAdd = (value) => {
    if (!value.trim()) return;
    if (!selectedValues.includes(value)) {
      onSelect(value.trim());
    }
    setInputValue("");
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* INPUT */}
      <input
  type="text"
  value={inputValue}
  placeholder={placeholder}
  onChange={(e) => {
    setInputValue(e.target.value);
    setOpen(true);
  }}
  onFocus={() => setOpen(true)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();      // ⛔ stop form submission
      handleAdd(inputValue);  // ✅ add skill instead
    }
  }}
  className="w-full px-3 pr-9 py-2 border border-gray-300 rounded-md
             text-sm text-gray-800 bg-white
             focus:outline-none focus:ring-1 focus:ring-[#101010]"
/>

      <span
  className={`absolute right-3 top-1/2 -translate-y-1/2
              text-gray-500 pointer-events-none
              transition-transform duration-200
              ${open ? "rotate-180" : ""}`}
>
  ▼
</span>


      {/* DROPDOWN */}
      {open && filteredOptions.length > 0 && (
        <div
          className="absolute z-30 mt-1 w-full max-h-48 overflow-y-auto
                     bg-white border border-gray-300 rounded-xl shadow-md"
        >
          {filteredOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleAdd(option)}
              className="px-4 py-2 cursor-pointer text-sm
                         hover:bg-[#F4FBFD]"
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {/* ADD CUSTOM */}
      {open && inputValue.trim() && (
        <div
          onClick={() => handleAdd(inputValue)}
          className="mt-2 inline-block px-4 py-2 bg-[#FF7A30]
                     text-white rounded-lg text-sm cursor-pointer"
        >
          Add “{inputValue}”
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
