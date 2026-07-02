import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export const SearchableSelect = ({
  name,
  id,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const filteredOptions = options.filter((opt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (opt.searchTerms) {
      return opt.searchTerms.includes(query);
    }
    return opt.label.toLowerCase().includes(query);
  });

  const handleSelect = (val) => {
    onChange({
      target: {
        name,
        value: val,
      },
    });
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({
      target: {
        name,
        value: "",
      },
    });
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Selector Trigger Button */}
      <div
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white border-b-2 border-gray-300 py-2 px-3 text-sm text-gray-800 flex items-center justify-between cursor-pointer focus-within:border-primary transition-colors min-h-[38px]"
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {displayLabel}
        </span>
        <div className="flex items-center gap-1 text-gray-400">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "transform rotate-180 text-primary" : ""}`} />
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden flex flex-col max-h-64">
          {/* Search Box */}
          <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none border-none py-0.5"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 max-h-48 divide-y divide-gray-50">
            {filteredOptions.length === 0 ? (
              <div className="py-3 px-3 text-xs text-gray-400 text-center">
                No matches found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`py-2.5 px-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
