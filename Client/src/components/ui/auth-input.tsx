import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  error?: string;
}

const AuthInput: React.FC<InputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightIcon,
  onRightIconClick,
  error,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={`w-full py-2 px-8 ${Icon ? 'pl-10' : ''} border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          } focus:border-transparent placeholder-gray-400 dark:text-primary-foreground`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {rightIcon && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
            onClick={onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default AuthInput;