import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const TopNavBar: React.FC = () => {
  useAuth();

  return (
    <header className="bg-surface-charcoal/80 dark:bg-surface-charcoal/80 fixed top-0 w-full z-50 backdrop-blur-xl border-b border-glass-border shadow-[0_0_15px_rgba(0,210,255,0.1)]">
      <div className="flex justify-between items-center w-full px-margin-desktop py-unit max-w-container-max mx-auto h-16">
        
        {/* Brand */}
        <div className="flex items-center gap-4">
          <span className="font-display-lg text-headline-lg-mobile md:text-headline-lg tracking-tighter text-primary animate-pulse">
            A.R.K.O.S_HUD
          </span>
        </div>

        {/* Search (Right aligned) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input 
              className="bg-surface-dim border border-outline-variant focus:border-primary text-data-mono font-data-mono rounded-DEFAULT pl-10 pr-4 py-1.5 focus:ring-0 focus:outline-none w-64 transition-all focus:shadow-[0_0_8px_rgba(0,210,255,0.3)] placeholder:text-outline-variant text-primary" 
              placeholder="SEARCH_DATABASE..." 
              type="text"
            />
          </div>
          
          {/* Trailing Icon Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-DEFAULT text-on-surface-variant hover:text-primary-container hover:bg-white/5 transition-colors active:scale-95 duration-75">
              <span className="material-symbols-outlined">settings_input_component</span>
            </button>
            <button className="p-2 rounded-DEFAULT text-on-surface-variant hover:text-primary-container hover:bg-white/5 transition-colors active:scale-95 duration-75">
              <span className="material-symbols-outlined">terminal</span>
            </button>
            <button className="p-2 rounded-DEFAULT text-on-surface-variant hover:text-primary-container hover:bg-white/5 transition-colors active:scale-95 duration-75 relative">
              <span className="material-symbols-outlined">sensors</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-container rounded-full animate-ping"></span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
