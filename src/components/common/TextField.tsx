import React, { useState } from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ 
  label, 
  error, 
  icon,
  type,
  className = '', 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-xs font-medium text-on-surface-variant px-1">
          {label}
        </label>
      )}
      <div className="relative group flex items-center">
        {icon && (
          <span className={`material-symbols-outlined absolute left-3 text-xl transition-colors ${error ? 'text-error' : 'text-on-surface-variant group-focus-within:text-primary'}`}>
            {icon}
          </span>
        )}
        <input 
          type={inputType}
          className={`w-full bg-transparent border rounded-md py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all 
            ${icon ? 'pl-10' : 'px-4'}
            ${isPassword ? 'pr-10' : 'pr-4'}
            ${error 
              ? 'border-error focus:ring-error/20 focus:border-error' 
              : 'border-outline focus:ring-primary/20 focus:border-primary focus:border-2'
            }`}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 flex items-center justify-center text-on-surface-variant hover:text-on-surface focus:outline-none transition-colors"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-xl">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}

        {error && !isPassword && icon === 'mail' && (
          <span className="material-symbols-outlined absolute right-3 text-xl text-error">
            error
          </span>
        )}
      </div>
      {error && <span className="text-[11px] text-error px-1">{error}</span>}
    </div>
  );
};
