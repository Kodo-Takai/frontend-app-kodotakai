import { useState, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface searchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Search({ 
  onSearch, 
  placeholder = "Buscar lugares, hoteles, restaurantes...",
  className = ""
}: searchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
    }
  };

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Manejar tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400" />
        </div>
        
        {/* Input de búsqueda */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-2 py-2 text-base border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all hover:shadow-md"
          autoComplete="off"
        />
        
        {/* Botón limpiar */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Botón de búsqueda para móviles (opcional) */}
  {/*     {query && (
        <button
          onClick={() => onSearch?.(query.trim())}
          className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full transition-colors shadow-sm md:hidden"
        >
          Buscar
        </button> */}
    </div>
  );
}