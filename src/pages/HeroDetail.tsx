import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { heroService } from '../services/heroService';
import type { Hero } from '../services/heroService';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';

export const HeroDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      if (!id) return;
      try {
        const data = await heroService.getById(Number(id));
        setHero(data);
      } catch (error) {
        console.error("Error fetching hero", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [id]);

  if (loading) return <LoadingState message="Accediendo a archivo de operativo..." />;
  if (!hero) return (
    <EmptyState 
      title="OPERATIVO NO ENCONTRADO" 
      description="El identificador proporcionado no existe en los registros." 
      action={
        <button 
          onClick={() => navigate('/heroes')} 
          className="border border-primary text-primary px-4 py-2 font-label-caps text-label-caps hover:bg-primary/10 transition-colors"
        >
          VOLVER
        </button>
      } 
    />
  );

  const missions = hero.missions || [];
  const completedMissions = missions.filter(m => m.estado === 'COMPLETADA').length;
  const successRate = missions.length > 0 ? Math.round((completedMissions / missions.length) * 100) : 0;

  return (
    <div className="max-w-container-max mx-auto space-y-gutter pb-8">
      {/* Header / Top actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/heroes')}
          className="flex items-center gap-2 text-outline hover:text-primary transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span className="font-label-caps text-label-caps">VOLVER AL DIRECTORIO</span>
        </button>
        {useAuth().user?.role === 'ADMIN' && (
          <button 
            onClick={() => navigate(`/heroes/${hero.id}/edit`)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-on-surface px-4 py-2 rounded-DEFAULT hover:bg-white/10 hover:border-white/20 transition-all font-label-caps text-label-caps"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            ACTUALIZAR PROTOCOLO
          </button>
        )}
      </div>

      {/* Hero Profile Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-gutter bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg p-6 md:p-8">
        
        {/* Photo and basic info */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-48 h-48 rounded-lg bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {hero.imagen_url ? (
              <img src={hero.imagen_url} alt={hero.nombre} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-outline opacity-50" style={{ fontSize: '64px' }}>shield</span>
            )}
          </div>
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface tracking-tight mb-1">{hero.nombre}</h2>
            <span className="font-metadata text-metadata text-outline">{hero.nombre_real || 'IDENTIDAD RESTRINGIDA'}</span>
          </div>
          <span className={`font-label-caps px-3 py-1 rounded-full border text-[11px] ${hero.estado.toLowerCase() === 'activo' ? 'border-primary text-primary bg-primary/10' : 'border-outline text-outline bg-surface-dim'}`}>
            STATUS: {hero.estado}
          </span>
        </div>

        {/* Detailed Stats */}
        <div className="flex flex-col gap-6">
          
          <div>
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest border-b border-glass-border/50 pb-2 mb-4">
              PERFIL TÁCTICO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-DEFAULT">
                <span className="font-label-caps text-[11px] text-outline block mb-2">PODER PRINCIPAL</span>
                <span className="font-data-mono text-primary">{hero.poder_principal}</span>
              </div>
              <div className="bg-black/20 p-4 rounded-DEFAULT">
                <span className="font-label-caps text-[11px] text-outline block mb-2">NIVEL DE PODER REGISTRADO</span>
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-[18px]">activity_zone</span>
                  <span className="font-data-mono text-xl font-bold">{hero.nivel_poder}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-label-caps text-secondary-container tracking-widest border-b border-glass-border/50 pb-2 mb-4">
              ESTADÍSTICAS DE CAMPO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/20 p-4 rounded-DEFAULT text-center">
                <span className="font-data-mono text-3xl font-bold text-primary block mb-1">{missions.length}</span>
                <span className="font-metadata text-metadata text-outline">MISIONES TOTALES</span>
              </div>
              <div className="bg-black/20 p-4 rounded-DEFAULT text-center">
                <span className="font-data-mono text-3xl font-bold text-[#4ade80] block mb-1">{completedMissions}</span>
                <span className="font-metadata text-metadata text-outline">COMPLETADAS</span>
              </div>
              <div className="bg-black/20 p-4 rounded-DEFAULT text-center">
                <span className="font-data-mono text-3xl font-bold text-secondary-container block mb-1">{successRate}%</span>
                <span className="font-metadata text-metadata text-outline">TASA DE ÉXITO</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Missions Log */}
      <div>
        <h3 className="font-label-caps text-label-caps text-on-surface tracking-widest mb-4">HISTORIAL DE MISIONES</h3>
        <div className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg overflow-hidden">
          {missions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glass-border/30 bg-surface-dim/50">
                    <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal">MISIÓN</th>
                    <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal">FECHA</th>
                    <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal">UBICACIÓN</th>
                    <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal">AMENAZA</th>
                    <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal text-right">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-data-mono text-on-surface-variant">
                  {missions.map((mission: any) => (
                    <tr key={mission.id} className="border-b border-glass-border/10 hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[16px]">target</span>
                          <span className="text-on-surface font-medium">{mission.titulo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-outline">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>{new Date(mission.fecha).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-outline">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span>{mission.ubicacion}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-outline">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          <span>{mission.nivel_peligro}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT border text-[11px] ${mission.estado === 'COMPLETADA' ? 'border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10' : mission.estado === 'ACTIVA' ? 'border-primary text-primary bg-primary/10' : 'border-outline text-outline bg-surface-dim'}`}>
                          {mission.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-outline">
              <span className="font-data-mono">No hay registros de misiones para este operativo.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
