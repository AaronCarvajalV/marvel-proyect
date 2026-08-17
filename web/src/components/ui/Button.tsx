import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-black hover:bg-primary-container border border-primary hover:border-primary-container shadow-[0_0_15px_rgba(0,255,204,0.3)] hover:shadow-[0_0_25px_rgba(0,255,204,0.5)]';
      case 'secondary':
        return 'bg-white/5 text-on-surface hover:bg-white/10 border border-white/10 hover:border-white/20';
      case 'ghost':
        return 'bg-transparent text-outline hover:text-primary hover:bg-white/5 border border-transparent';
    }
  };

  return (
    <button
      className={`font-label-caps text-label-caps flex items-center justify-center gap-2 px-6 py-3 rounded-DEFAULT transition-all duration-300 ${getVariantClasses()} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
