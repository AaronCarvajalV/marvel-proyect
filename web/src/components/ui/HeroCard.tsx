import React from 'react';
import type { Hero } from '../../services/heroService';
import { Link } from 'react-router-dom';

interface HeroCardProps {
  hero: Hero;
}

export const HeroCard: React.FC<HeroCardProps> = ({ hero }) => {
  return (
    <Link 
      to={`/heroes/${hero.id}`}
      className="bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-primary/50 transition-colors group relative overflow-hidden block"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-DEFAULT bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-glass-border">
          {hero.imagen_url ? (
            <img src={hero.imagen_url} alt={hero.nombre} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-outline opacity-50">shield</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-data-mono text-on-surface font-bold truncate">
            {hero.nombre}
          </h4>
          <span className="font-metadata text-metadata text-outline truncate block">
            {hero.nombre_real || 'ID DESCONOCIDA'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-black/20 p-3 rounded-DEFAULT mb-4">
        <div className="flex flex-col min-w-0">
          <span className="font-label-caps text-[10px] text-outline">PODER PRINCIPAL</span>
          <span className="font-data-mono text-primary text-[13px] truncate" title={hero.poder_principal}>
            {hero.poder_principal}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-caps text-[10px] text-outline">NIVEL PODER</span>
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[14px]">activity_zone</span>
            <span className="font-data-mono text-[13px]">{hero.nivel_poder}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-glass-border/30 pt-3">
        <div className="flex items-center gap-1 text-outline">
          <span className="material-symbols-outlined text-[14px]">tag</span>
          <span className="font-data-mono text-[11px]">ID-{hero.id.toString().padStart(4, '0')}</span>
        </div>
        <span className={`font-label-caps text-[10px] px-2 py-0.5 rounded-DEFAULT border ${hero.estado.toLowerCase() === 'activo' ? 'border-primary text-primary bg-primary/10' : 'border-outline text-outline bg-surface-dim'}`}>
          {hero.estado}
        </span>
      </div>
    </Link>
  );
};
