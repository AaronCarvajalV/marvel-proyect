import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`space-y-1 relative group ${className}`}>
      <label className={`font-label-caps text-label-caps tracking-widest block ${error ? 'text-[#ef4444]' : 'text-primary'}`}>
        {label}
      </label>
      <div className="relative">
        <input
          className={`w-full bg-surface-charcoal/50 border rounded-[4px] py-3 px-4 font-data-mono text-data-mono text-on-surface focus:outline-none transition-all placeholder:text-on-surface-variant/30 ${error ? 'border-[#ef4444] focus:border-[#ef4444]' : 'border-glass-border focus:border-primary/50 focus:bg-surface-charcoal/80'}`}
          {...props}
        />
        {!error && (
          <div className="absolute inset-0 border border-primary/20 rounded-[4px] pointer-events-none opacity-0 group-focus-within:opacity-100 group-focus-within:animate-pulse-slow"></div>
        )}
      </div>
      {error && <span className="font-metadata text-metadata text-[#ef4444] block mt-1">{error}</span>}
    </div>
  );
};
