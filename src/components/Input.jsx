import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, id, error, type = "text", className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type === 'password' && showPassword ? 'text' : type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl 
            transition-all duration-300 ease-in-out
            ${error 
              ? 'border-red-400 dark:border-red-500 focus:border-red-500 dark:focus:border-red-400' 
              : isFocused 
                ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }
            text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-0
            ${className}`}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};


export default Input;