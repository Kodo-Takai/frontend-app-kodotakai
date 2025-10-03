import { useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface searchProps {
  value?: string;
  onChange?: (query: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Search({
  value = "",
  onChange = () => {},
  onSearch = () => {},
  placeholder = "Buscar lugares...",
  className = "",
}: searchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verificamos si hay valor antes de llamar a onSearch
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Llamamos a la función onChange
    onChange(e.target.value);
  };

  const clearSearch = () => {
    // Llamamos a la función onChange para borrar el texto
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
}
