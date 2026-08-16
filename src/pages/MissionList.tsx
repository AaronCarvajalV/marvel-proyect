import React, { useEffect, useState } from 'react';
import { missionService } from '../services/missionService';
import type { Mission } from '../services/missionService';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MissionList: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await missionService.getAll();
        setMissions(data);
      } catch (error) {
        console.error("Error fetching missions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  const filteredMissions = missions.filter(m => 
    m.titulo.toLowerCase().includes(search.toLowerCase()) || 
    m.ubicacion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-container-max mx-auto space-y-gutter">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-sm">public</span>
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest">OPERATIONS_LOG</h3>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface tracking-tight">
            Active Missions
          </h1>
          <p className="font-data-mono text-data-mono text-on-surface-variant mt-2">
            Registro global de operaciones y amenazas.
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <Link 
            to="/missions/new" 
            className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary text-primary px-4 py-2 rounded-DEFAULT font-label-caps text-label-caps transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            NUEVA MISIÓN
          </Link>
        )}
      </section>

      {/* Search Section */}
      <section className="bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-2 flex items-center gap-2 focus-within:border-primary/50 transition-colors">
        <span className="material-symbols-outlined text-outline ml-2">search</span>
        <input 
          type="text" 
          placeholder="Buscar misiones por título o ubicación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-on-surface font-data-mono text-data-mono flex-1 px-2 py-2 placeholder:text-outline"
        />
      </section>

      {/* Grid Section */}
      <section className="pb-8">
        {loading ? (
          <LoadingState message="Interceptando comunicaciones..." />
        ) : filteredMissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredMissions.map(mission => (
              <div 
                key={mission.id} 
                onClick={() => user?.role === 'ADMIN' ? navigate(`/missions/${mission.id}/edit`) : null}
                className={`bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-6 group relative overflow-hidden transition-colors block ${user?.role === 'ADMIN' ? 'hover:border-primary/50 cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity ${user?.role === 'ADMIN' ? 'group-hover:opacity-100' : ''}`}></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">target</span>
                    <h3 className="font-data-mono text-lg font-bold text-on-surface m-0 leading-tight">{mission.titulo}</h3>
                  </div>
                  <span className={`font-label-caps text-[10px] px-2 py-0.5 rounded-DEFAULT border shrink-0 ${mission.estado === 'COMPLETADA' ? 'border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10' : mission.estado === 'ACTIVA' ? 'border-primary text-primary bg-primary/10' : 'border-outline text-outline bg-surface-dim'}`}>
                    {mission.estado}
                  </span>
                </div>
                
                <p className="font-metadata text-metadata text-outline mb-6 line-clamp-2">
                  {mission.descripcion || 'Sin descripción detallada.'}
                </p>

                <div className="grid grid-cols-2 gap-3 bg-black/20 p-3 rounded-DEFAULT">
                  <div className="flex items-center gap-2 text-secondary-container">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="font-metadata text-[11px] truncate">{mission.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-outline">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span className="font-metadata text-[11px]">{new Date(mission.fecha).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[14px] ${mission.nivel_peligro === 'EXTREMO' ? 'text-[#ef4444]' : 'text-outline'}`}>warning</span>
                    <span className={`font-metadata text-[11px] ${mission.nivel_peligro === 'EXTREMO' ? 'text-[#ef4444]' : 'text-outline'}`}>{mission.nivel_peligro}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-caps text-[10px] text-outline">OP:</span>
                    <span className="font-metadata text-[11px] text-primary truncate">{mission.hero?.nombre || 'UNASSIGNED'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<span className="material-symbols-outlined text-4xl opacity-50">description</span>}
            title="SIN RESULTADOS"
            description={search ? "No se encontraron misiones que coincidan con la búsqueda." : "No hay misiones activas en el sistema."}
          />
        )}
      </section>
    </div>
  );
};
