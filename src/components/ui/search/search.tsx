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
    <div className={`relative w-full hover:scale-[1.01] transition-transform duration-300 ease-out ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="w-5 h-5 text-[#3c3e34]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 text-base rounded-xl bg-[var(--color-primary-beige)] text-[var(--color-primary-dark)] placeholder-[#3c3e34] border-2 border-[var(--color-primary-dark)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary-dark)]"
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--color-primary-dark)] hover:text-[var(--color-primary-dark)]"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
}
