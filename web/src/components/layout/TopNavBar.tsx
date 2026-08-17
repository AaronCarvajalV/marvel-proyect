import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { heroService, type Hero } from '../../services/heroService';

export const TopNavBar: React.FC = () => {
  useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all heroes for the search index
    heroService.getAll().then(setHeroes).catch(console.error);
    
    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHeroes([]);
      setIsDropdownOpen(false);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const results = heroes.filter(h => 
      h.nombre.toLowerCase().includes(lowerQuery) || 
      (h.nombre_real && h.nombre_real.toLowerCase().includes(lowerQuery))
    );
    setFilteredHeroes(results);
    setIsDropdownOpen(true);
  }, [searchQuery, heroes]);

  const handleSelectHero = (heroId: number) => {
    setSearchQuery('');
    setIsDropdownOpen(false);
    navigate(`/heroes/${heroId}`);
  };

  return (
    <header className="bg-surface-charcoal/80 dark:bg-surface-charcoal/80 fixed top-0 w-full z-50 backdrop-blur-xl border-b border-glass-border shadow-[0_0_15px_rgba(0,210,255,0.1)]">
      <div className="flex justify-between items-center w-full px-margin-desktop py-unit max-w-container-max mx-auto h-16">
        
        {/* Brand */}
        <div className="flex items-center gap-4">
          <span className="font-display-lg text-headline-lg-mobile md:text-headline-lg tracking-tighter text-primary animate-pulse">
            HEROS ORG.
          </span>
        </div>

        {/* Search (Right aligned) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group" ref={dropdownRef}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input 
              className="bg-surface-dim border border-outline-variant focus:border-primary text-data-mono font-data-mono rounded-DEFAULT pl-10 pr-4 py-1.5 focus:ring-0 focus:outline-none w-64 transition-all focus:shadow-[0_0_8px_rgba(0,210,255,0.3)] placeholder:text-outline-variant text-primary" 
              placeholder="SEARCH_DATABASE..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(searchQuery) setIsDropdownOpen(true); }}
            />
            {/* Predictive Dropdown */}
            {isDropdownOpen && filteredHeroes.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-surface-charcoal border border-glass-border rounded-DEFAULT shadow-lg z-50 overflow-hidden">
                {filteredHeroes.map(hero => (
                  <div 
                    key={hero.id}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center justify-between border-b border-glass-border/30 last:border-0"
                    onClick={() => handleSelectHero(hero.id)}
                  >
                    <div>
                      <div className="font-data-mono text-primary text-sm">{hero.nombre}</div>
                      <div className="font-metadata text-outline text-[10px]">{hero.nombre_real || 'CLASSIFIED'}</div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-xs">chevron_right</span>
                  </div>
                ))}
              </div>
            )}
            {isDropdownOpen && filteredHeroes.length === 0 && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 w-full mt-1 bg-surface-charcoal border border-glass-border rounded-DEFAULT shadow-lg z-50 px-4 py-3">
                 <div className="font-data-mono text-error text-xs">NO_MATCHES_FOUND</div>
              </div>
            )}
          </div>
          
          {/* Trailing Icon Actions */}
          <div className="flex items-center gap-2">
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
