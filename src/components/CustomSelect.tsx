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
  borderColor = 'border-[#48877b]',
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
        <label className="block text-xs sm:text-[13px] font-bold text-[#19223c] mb-2 text-right">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Button / Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white text-slate-900 text-xs font-semibold py-2.5 px-3 rounded-xl border ${borderColor} focus:outline-hidden transition-all shadow-2xs flex items-center justify-between cursor-pointer ${
          isOpen ? 'ring-2 ring-[#48877b]/20 shadow-xs' : ''
        }`}
      >
        {/* Chevron on the far left */}
        <ChevronDown
          className={`w-4 h-4 text-slate-700 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#48877b]' : ''
          }`}
        />

        {/* Selected text on the right */}
        <span className="text-right truncate flex-1 pr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </button>

      {/* Dropdown Menu matching user screenshot */}
      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+4px)] right-0 left-0 bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden py-0.5 text-right animate-in fade-in duration-100 max-h-60 overflow-y-auto">
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors text-right select-none ${
                  isSelected
                    ? 'bg-[#3b66db] text-white font-bold'
                    : 'text-slate-800 hover:bg-slate-100/90'
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
