import React, { useState, useRef, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";

registerLocale("es", es);

interface CustomDateInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const CustomDateInput: React.FC<CustomDateInputProps> = ({
  id,
  name,
  value,
  onChange,
  className = "",
  disabled = false,
  placeholder = "Selecciona una fecha",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<DatePicker>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      onChange(formattedDate);
    } else {
      onChange("");
    }
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        name={name}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          block w-full px-4 py-4 pr-12 text-sm rounded-2xl border text-left
          transition-all duration-200 focus:outline-none focus:ring-2
          ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "cursor-pointer"
          }
          ${isOpen ? "ring-2" : ""}
        `}
        style={{
          backgroundColor: disabled ? "var(--color-gray-100)" : "var(--color-beige)",
          borderColor: disabled ? "var(--color-gray-200)" : isOpen ? "var(--color-blue)" : "var(--color-beige)",
          color: selectedDate ? "var(--color-blue)" : "var(--color-blue-light)",
        }}
      >
        <span className="block truncate">
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
      </button>

      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "var(--color-blue)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {isOpen && (
        <div 
          className="absolute z-50 mt-1 border rounded-2xl shadow-xl overflow-hidden custom-datepicker-wrapper"
          style={{ 
            backgroundColor: "var(--color-bone)", 
            borderColor: "var(--color-beige)" 
          }}
        >
          <DatePicker
            ref={datePickerRef}
            selected={selectedDate}
            onChange={handleDateChange}
            onClickOutside={() => setIsOpen(false)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholder}
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            yearDropdownItemNumber={100}
            scrollableYearDropdown
            inline
          />
        </div>
      )}
    </div>
  );
};

export default CustomDateInput;
