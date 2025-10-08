import React, { useState, useRef, useEffect, useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex].value);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, options, handleSelect]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        id={id}
        name={name}
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          block w-full px-4 py-4 pr-10 text-sm rounded-2xl border text-left
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00324A]/20
          ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-[#EEEEEE] border-[#DEDEDE] hover:border-[#00324A]/30 cursor-pointer"
          }
          ${selectedOption ? "text-[#322C2C]" : "text-[#AEAEAE]"}
          ${isOpen ? "border-[#00324A] ring-2 ring-[#00324A]/20" : ""}
        `}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg
            className={`h-4 w-4 text-[#AEAEAE] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#DEDEDE] rounded-xl shadow-lg overflow-hidden">
          <ul className="max-h-60 overflow-auto py-1">
            {options.map((option, index) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-4 py-3 text-sm text-left transition-colors duration-150
                    hover:bg-[#00324A]/5 focus:outline-none focus:bg-[#00324A]/5
                    ${highlightedIndex === index ? "bg-[#00324A]/10" : ""}
                    ${
                      option.value === value
                        ? "bg-[#00324A]/10 text-[#00324A] font-medium"
                        : "text-[#322C2C]"
                    }
                  `}
                >
                  <span className="flex items-center justify-between">
                    {option.label}
                    {option.value === value && (
                      <svg
                        className="h-4 w-4 text-[#00324A]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
