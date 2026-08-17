import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { heroService, type Hero } from '../services/heroService';
import { useFavorites } from '../context/FavoritesContext';

export const HeroNetwork: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [segment, setSegment] = useState<'ALL' | 'FAVORITES'>('ALL');
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const data = await heroService.getAll();
        setHeroes(data);
      } catch (error) {
        console.error("Failed to fetch heroes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroes();
  }, []);

  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero => {
      if (segment === 'ALL') return true;
      return isFavorite(hero.id);
    });
  }, [heroes, segment, isFavorite]);

  return (
    <div className="max-w-container-max mx-auto pb-24">
      {/* Header & Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-glass-border pb-4">
          <div>
            <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tighter uppercase">HERO NETWORK</h1>
          </div>
          
          {/* Segments: ALL / FAVORITES */}
          <div className="flex gap-2">
            <button
              onClick={() => setSegment('ALL')}
              className={`px-4 py-2 font-data-mono text-sm tracking-wider uppercase border transition-colors ${
                segment === 'ALL' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-glass-border bg-surface-charcoal text-text-muted hover:border-primary/50 hover:text-primary'
              }`}
            >
              ALL OPERATIVES
            </button>
            <button
              onClick={() => setSegment('FAVORITES')}
              className={`px-4 py-2 font-data-mono text-sm tracking-wider uppercase border transition-colors flex items-center gap-2 ${
                segment === 'FAVORITES' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-glass-border bg-surface-charcoal text-text-muted hover:border-primary/50 hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">star</span>
              FAVORITES
            </button>
          </div>
        </div>
      </div>

      {/* Roster Grid */}
      {isLoading ? (
        <div className="text-primary font-data-mono animate-pulse">LOADING_ROSTER...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHeroes.map(hero => {
            const name = hero.nombre.toUpperCase();
            const isCovert = hero.estado === 'INACTIVO' || hero.estado === 'MIA';
            
            const cardBorder = isCovert ? 'border-technical-gray hover:border-secondary-container/40' : 'border-glass-border hover:border-primary/60';
            const accentColorClass = isCovert ? 'text-secondary-container' : 'text-primary';
            const badgeBg = isCovert ? 'bg-secondary-container' : 'bg-primary';

            let heroIcon = 'shield';
            if (name.includes('IRON MAN')) heroIcon = 'rocket_launch';
            else if (name.includes('THOR')) heroIcon = 'bolt';
            else if (name.includes('SPIDER')) heroIcon = 'bug_report';
            else if (name.includes('WITCH')) heroIcon = 'auto_awesome';
            else if (name.includes('WIDOW')) heroIcon = 'crisis_alert';
            else if (name.includes('HULK')) heroIcon = 'fitness_center';
            else if (name.includes('CAPITÁN AMÉRICA') || name.includes('CAPITAN AMERICA')) heroIcon = 'shield';
            else if (name.includes('STRANGE')) heroIcon = 'visibility';
            else if (name.includes('HAWKEYE')) heroIcon = 'track_changes';
            else if (name.includes('LOKI')) heroIcon = 'psychology';
            else if (name.includes('PANTHER')) heroIcon = 'pets';
            else if (name.includes('VISION')) heroIcon = 'memory';
            else if (name.includes('FALCON')) heroIcon = 'flight';
            else if (name.includes('WINTER SOLDIER')) heroIcon = 'hardware';
            else if (name.includes('ANT-MAN') || name.includes('ANT MAN')) heroIcon = 'zoom_in';
            else if (name.includes('WASP')) heroIcon = 'flight';
            else if (name.includes('STAR-LORD') || name.includes('STAR LORD')) heroIcon = 'headphones';
            else if (name.includes('GROOT')) heroIcon = 'park';
            else if (name.includes('MARVEL')) heroIcon = 'star';
            else if (name.includes('WOLVERINE')) heroIcon = 'content_cut';
            else if (name.includes('DEADPOOL')) heroIcon = 'sentiment_very_satisfied';
            else if (name.includes('DAREDEVIL')) heroIcon = 'hearing';

            const fav = isFavorite(hero.id);

            return (
              <div className="relative block group" key={hero.id}>
                <Link to={`/heroes/${hero.id}`} className="block h-full">
                  <article className={`relative bg-surface-charcoal border ${cardBorder} rounded-lg overflow-hidden group transition-all duration-300 h-full`}>
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"></div>
                    {!isCovert && <div className="absolute top-0 left-0 w-full h-1 scan-line z-20 pointer-events-none"></div>}
                    {isCovert && <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary-container/20 to-transparent z-20`}></div>}
                    
                    <div className={`relative h-64 overflow-hidden border-b ${!isCovert ? 'border-glass-border' : 'border-technical-gray/50'}`}>
                      <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity group-hover:opacity-80" 
                        alt={hero.nombre}
                        src={hero.imagen_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDAfQWN9tiQ0bvTT7IEP1tALNwpsB1gCusw-5Y7VERnlRtr2kcFGt6uBTDta_BPsV0pY84POUiP6zzL_K99KkFdzw_woJODSHE7zbPz9iHOZKD3tRGT6_G2o0D4Q-kTFJfIPCbqRo0ZTMydh7eWgn0k0nnxHTpAjNb4x5wgQ75Rz6qKpPaMTRUc5perDfVWExOxANYtUDnPgVj5yQCHx2KBMAF-pNUxYHH9V_zwbF_EiwYqJfMoRedl"} 
                      />
                      <div className={`absolute top-2 left-2 bg-black/60 backdrop-blur-md border ${!isCovert ? 'border-primary/30 text-primary' : 'border-secondary-container/30 text-secondary-container'} px-2 py-0.5 rounded font-data-mono text-metadata flex items-center gap-1 z-10`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeBg} ${hero.estado === 'ACTIVO' ? 'animate-pulse' : ''}`}></span> {hero.estado}
                      </div>
                      <div className="absolute top-2 right-2 font-data-mono text-metadata text-outline/70 bg-black/50 px-1 rounded z-10">ID: STK-{hero.id.toString().padStart(3, '0')}</div>
                    </div>
                    
                    <div className="p-4 relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className={`font-display-lg text-headline-lg-mobile text-on-surface uppercase tracking-tight group-hover:${accentColorClass} transition-colors`}>{hero.nombre}</h2>
                          <p className="font-data-mono text-metadata text-outline">{hero.nombre_real || 'CLASSIFIED'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(hero.id); }}
                            className={`p-1.5 rounded-full backdrop-blur-md border transition-colors ${fav ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-charcoal border-glass-border/50 text-text-muted hover:text-primary hover:border-primary/50'}`}
                          >
                            <span className={`material-symbols-outlined text-[16px] ${fav ? 'fill-icon' : ''}`}>star</span>
                          </button>
                          <span className={`material-symbols-outlined ${accentColorClass} text-[28px] opacity-70 group-hover:opacity-100`}>
                            {heroIcon}
                          </span>
                        </div>
                      </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                      <div>
                        <div className="font-data-mono text-[10px] text-outline mb-1">MAIN POWER</div>
                        <div className="font-data-mono text-data-mono text-on-surface-variant truncate">{hero.poder_principal}</div>
                      </div>
                      <div>
                        <div className="font-data-mono text-[10px] text-outline mb-1">POWER LEVEL</div>
                        <div className="font-data-mono text-data-mono text-tertiary">LVL_{hero.nivel_poder}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-t border-technical-gray/30 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-data-mono text-metadata text-outline">COMBAT_READINESS</span>
                        <span className={`font-data-mono text-metadata ${accentColorClass}`}>
                          {hero.nivel_poder}%
                        </span>
                      </div>
                      <div className="h-1 w-full bg-technical-gray rounded-full overflow-hidden border border-technical-gray/50">
                        <div className={`h-full ${badgeBg}`} style={{ width: `${Math.min(100, hero.nivel_poder)}%`, boxShadow: !isCovert ? "0 0 8px rgba(0,210,255,0.8)" : "none" }}></div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

