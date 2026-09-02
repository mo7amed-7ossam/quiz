import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  label?: string;
  required?: boolean;
  options: (string | SelectOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  borderColor?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  required = false,
  options,
  value,
  onChange,
  placeholder = 'اختر...',
  className = '',
  borderColor = 'border-slate-200 hover:border-slate-300',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options
  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-[#19223c] mb-1.5 text-right">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Button / Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-10 bg-white text-slate-800 text-xs sm:text-sm font-medium px-3.5 rounded-xl border ${borderColor} focus:outline-hidden transition-all shadow-2xs flex items-center justify-between cursor-pointer ${
          isOpen ? 'border-[#16a085] ring-2 ring-[#16a085]/15 shadow-xs' : ''
        }`}
      >
        {/* Chevron on the far left */}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#16a085]' : ''
          }`}
        />

        {/* Selected text on the right */}
        <span className={`text-right truncate flex-1 pr-2 ${!selectedOption ? 'text-slate-400' : 'text-slate-800'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+4px)] right-0 left-0 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 text-right animate-in fade-in duration-100 max-h-60 overflow-y-auto">
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium cursor-pointer transition-colors text-right select-none ${
                  isSelected
                    ? 'bg-[#16a085] text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>{option.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
