import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { heroService, type Hero } from '../services/heroService';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export const HeroDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchHero = async () => {
      try {
        const data = await heroService.getById(parseInt(id, 10));
        setHero(data);
      } catch (error) {
        console.error("Failed to fetch hero", error);
        navigate('/heroes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();
  }, [id, navigate]);

  if (isLoading) {
    return <div className="max-w-container-max mx-auto text-primary font-data-mono animate-pulse pt-10">ACCESSING_SECURE_RECORDS...</div>;
  }

  if (!hero) {
    return null; // Will redirect in useEffect catch
  }


  const isCovert = hero.estado === 'INACTIVO' || hero.estado === 'MIA';
  const accentColorClass = isCovert ? 'text-secondary-container' : 'text-primary';
  const badgeBg = isCovert ? 'bg-secondary-container' : 'bg-primary';

  return (
    <>
      <style>
        {`
          .precision-grid {
              background-image: 
                  linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
              background-size: 32px 32px;
          }
          .hud-border {
              border: 1px solid var(--glass-border, rgba(0, 210, 255, 0.2));
              box-shadow: inset 0 0 10px rgba(0, 210, 255, 0.05);
          }
          .text-glow {
              text-shadow: 0 0 8px rgba(0, 210, 255, 0.6);
          }
          .alert-glow {
              text-shadow: 0 0 8px rgba(254, 170, 0, 0.6);
          }
          .scan-line {
              background: linear-gradient(to right, transparent, rgba(0, 210, 255, 0.5), transparent);
              height: 1px;
              width: 100%;
          }
          @keyframes scan {
              0% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
          }
        `}
      </style>

      {/* Precision Grid Overlay */}
      <div className="fixed inset-0 precision-grid -z-10 pointer-events-none"></div>
      
      {/* Main Container */}
      <div className="max-w-container-max mx-auto flex flex-col lg:flex-row gap-6 pb-24">
        
        {/* Left Column: Holographic Profile */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          <div className="relative w-full aspect-[3/4] bg-surface-charcoal/80 backdrop-blur-md rounded-lg hud-border overflow-hidden group">
            {/* Scan Line Animation */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 flex flex-col justify-between p-4">
              <div className="flex justify-between items-start">
                <span className={`font-metadata text-metadata ${accentColorClass} ${badgeBg}/10 px-2 py-1 rounded-DEFAULT border border-glass-border`}>ID: STK-{hero.id.toString().padStart(3, '0')}</span>
                <div className="flex gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${badgeBg} animate-pulse`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full ${badgeBg}/30`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full ${badgeBg}/30`}></div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="font-data-mono text-data-mono text-on-surface-variant">
                  STATUS: <span className={accentColorClass}>{hero.estado}</span>
                </div>
                <span className={`material-symbols-outlined ${accentColorClass}/50 text-xl group-hover:${accentColorClass} transition-colors`}>fingerprint</span>
              </div>
            </div>
            
            <div className="absolute top-1/4 left-0 w-full scan-line z-20 animate-[scan_3s_ease-in-out_infinite]"></div>
            <img 
              alt={hero.nombre} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity filter contrast-125" 
              src={hero.imagen_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDAfQWN9tiQ0bvTT7IEP1tALNwpsB1gCusw-5Y7VERnlRtr2kcFGt6uBTDta_BPsV0pY84POUiP6zzL_K99KkFdzw_woJODSHE7zbPz9iHOZKD3tRGT6_G2o0D4Q-kTFJfIPCbqRo0ZTMydh7eWgn0k0nnxHTpAjNb4x5wgQ75Rz6qKpPaMTRUc5perDfVWExOxANYtUDnPgVj5yQCHx2KBMAF-pNUxYHH9V_zwbF_EiwYqJfMoRedl"} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-charcoal via-transparent to-surface-charcoal/40 z-10"></div>
          </div>
          
          {/* Threat Assessment Card */}
          <div className="bg-surface-charcoal/90 backdrop-blur-lg rounded-lg hud-border p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-glass-border pb-2">
              <span className="material-symbols-outlined text-secondary-container text-sm">warning</span>
              <h3 className="font-data-mono text-data-mono text-secondary-container">POWER_ASSESSMENT</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-on-surface alert-glow">LEVEL_{hero.nivel_poder}</div>
                <div className="font-metadata text-metadata text-on-surface-variant mt-1">{hero.nivel_poder > 80 ? 'HIGH_THREAT_AUTHORIZED' : 'STANDARD_PROTOCOL'}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-secondary-container font-data-mono text-data-mono">{hero.nivel_poder}%</div>
                <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden border border-glass-border">
                  <div className="h-full bg-secondary-container" style={{ width: `${hero.nivel_poder > 100 ? 100 : hero.nivel_poder}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Data & Actions */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          {/* Header Area */}
          <div className="flex flex-col gap-2 border-b border-glass-border pb-4">
            <div className="flex justify-between items-center">
              <div className={`font-data-mono text-data-mono ${accentColorClass} flex items-center gap-2`}>
                <span className={`w-2 h-2 rounded-full ${badgeBg} animate-pulse`}></span>
                OPERATIVE_PROFILE
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(hero.id)}
                  className={`px-3 py-2 border rounded-sm transition-colors flex items-center gap-2 ${isFavorite(hero.id) ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-charcoal/50 border-glass-border text-text-muted hover:text-primary hover:border-primary/50'}`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isFavorite(hero.id) ? 'fill-icon' : ''}`}>star</span>
                </button>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={`/heroes/${hero.id}/edit`}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 font-label-caps text-label-caps rounded-sm transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    EDIT OPERATIVE
                  </Link>
                )}
              </div>
            </div>
            <h1 className="font-display-lg text-[40px] md:text-display-lg text-on-surface leading-none tracking-tight">
              {hero.nombre}
            </h1>
            <div className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-2">
              REAL NAME: {hero.nombre_real || 'CLASSIFIED'} <br/>
              MAIN POWER: {hero.poder_principal}
            </div>
          </div>
          
          {/* Grid Layout for Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bio Stats */}
            <div className="bg-surface-charcoal/80 backdrop-blur-lg rounded-lg hud-border p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-glass-border pb-2">
                <span className={`material-symbols-outlined ${accentColorClass} text-sm`}>monitor_heart</span>
                <h3 className={`font-data-mono text-data-mono ${accentColorClass}`}>BIO_STATS</h3>
              </div>
              <div className="flex flex-col gap-3">
                {/* Stat Row */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-metadata text-metadata">
                    <span className="text-on-surface-variant">COMBAT_READINESS</span>
                    <span className={accentColorClass}>{hero.estado === 'ACTIVO' ? '98.4%' : '0.0%'}</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest border border-glass-border/50">
                    <div className={`h-full ${badgeBg}`} style={{ width: hero.estado === 'ACTIVO' ? '98.4%' : '0%' }}></div>
                  </div>
                </div>
                {/* Stat Row */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-metadata text-metadata">
                    <span className="text-on-surface-variant">POWER_LEVEL</span>
                    <span className={accentColorClass}>{hero.nivel_poder}%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest border border-glass-border/50">
                    <div className={`h-full ${badgeBg}`} style={{ width: `${hero.nivel_poder > 100 ? 100 : hero.nivel_poder}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Operational Status */}
            <div className="bg-surface-charcoal/80 backdrop-blur-lg rounded-lg hud-border p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-glass-border pb-2">
                <span className={`material-symbols-outlined ${accentColorClass} text-sm`}>radar</span>
                <h3 className={`font-data-mono text-data-mono ${accentColorClass}`}>OPERATIONAL_STATUS</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-DEFAULT border border-glass-border/30">
                  <div className={`w-3 h-3 rounded-full ${badgeBg} ${hero.estado === 'ACTIVO' ? 'shadow-[0_0_8px_rgba(0,210,255,0.8)]' : ''}`}></div>
                  <div>
                    <div className="font-label-caps text-label-caps text-on-surface">{hero.estado === 'ACTIVO' ? 'READY_FOR_DEPLOYMENT' : 'UNAVAILABLE'}</div>
                    <div className="font-metadata text-metadata text-on-surface-variant">LOC: CLASSIFIED</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 font-metadata text-metadata">
                  <div className="bg-surface-container-highest p-2 rounded-DEFAULT border border-glass-border/20">
                    <span className="text-on-surface-variant block mb-1">CLEARANCE</span>
                    <span className={accentColorClass}>LEVEL_{hero.nivel_poder > 80 ? 'OMEGA' : 'STANDARD'}</span>
                  </div>
                  <div className="bg-surface-container-highest p-2 rounded-DEFAULT border border-glass-border/20">
                    <span className="text-on-surface-variant block mb-1">REGISTERED</span>
                    <span className={accentColorClass}>{new Date(hero.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mission History */}
          <div className="bg-surface-charcoal/80 backdrop-blur-lg rounded-lg hud-border flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-glass-border p-4 bg-surface-charcoal/90">
              <span className={`material-symbols-outlined ${accentColorClass} text-sm`}>history</span>
              <h3 className={`font-data-mono text-data-mono ${accentColorClass}`}>ASSIGNED_MISSIONS</h3>
            </div>
            <div className="p-4 flex flex-col gap-2 overflow-y-auto max-h-48">
              {hero.missions && hero.missions.length > 0 ? (
                hero.missions.map((mission: any) => (
                  <div key={mission.id} className="flex items-center justify-between p-3 bg-surface-container-highest/50 border border-glass-border/30 rounded-DEFAULT hover:border-primary/50 hover:bg-white/5 transition-colors cursor-default group">
                    <div className="flex items-center gap-4">
                      <div className="font-data-mono text-data-mono text-on-surface-variant w-20 truncate">OP_{mission.id}</div>
                      <div className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">{mission.titulo}</div>
                    </div>
                    <div className={`font-label-caps text-label-caps ${mission.estado === 'COMPLETADA' ? 'text-primary bg-primary/10 border-primary/20' : mission.estado === 'PENDIENTE' ? 'text-outline bg-outline/10 border-outline/20' : 'text-secondary-container bg-secondary-container/10 border-secondary-container/20'} px-2 py-1 rounded-DEFAULT border`}>
                      {mission.estado}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-on-surface-variant font-data-mono p-4 text-center">NO_MISSIONS_ASSIGNED</div>
              )}
            </div>
          </div>
          

        </div>
      </div>
    </>
  );
};
