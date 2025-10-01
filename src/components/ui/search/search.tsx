import { useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

// 1. MODIFICADO: Añadimos 'value' y 'onChange' a las props
interface searchProps {
  value: string;
  onChange: (query: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Search({ 
  value,
  onChange,
  onSearch, 
  placeholder = "Buscar lugares...",
  className = ""
}: searchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 2. ELIMINADO: Ya no necesita su propio estado interno
  // const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Usa 'value' de las props
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Llama a la función del padre para actualizar el estado
    onChange(e.target.value);
  };

  const clearSearch = () => {
    // Llama a la función del padre para borrar el texto
    onChange('');
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
          value={value} // 3. Usa el valor de las props
          onChange={handleInputChange} // 4. Usa el handler que llama a las props
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-2 text-base border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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