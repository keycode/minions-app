import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative w-full md:w-64" ref={containerRef}>
      {/* Botón Principal (Trigger) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
      >
        <span>
          {selected.length > 0 ? `${selected.length} seleccionados` : label}
        </span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown Lista */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className={`w-4 h-4 border rounded flex items-center justify-center mr-3 ${
                selected.includes(option) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
              }`}>
                {selected.includes(option) && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-gray-700">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};