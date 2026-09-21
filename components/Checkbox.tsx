
import React from 'react';
import { CheckIcon } from './Icons';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div 
      onClick={onChange}
      className={`group flex items-start gap-4 p-4 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50`}
    >
      <div 
        className={`flex-shrink-0 w-5 h-5 mt-0.5 border-2 flex items-center justify-center transition-all rounded-none ${
          checked 
            ? 'bg-mag-gold border-mag-gold' 
            : 'bg-white border-gray-300'
        }`}
      >
        {checked && <CheckIcon className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className={`text-base leading-snug select-none ${checked ? 'text-gray-400 line-through' : 'text-mag-black font-black'}`}>
        {label}
      </span>
    </div>
  );
};
