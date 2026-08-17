import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { missionService, type Mission } from '../services/missionService';
import { useAuth } from '../context/AuthContext';

export const MissionList: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || 'ALL';

  const [timeString, setTimeString] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(initialStatus);

  useEffect(() => {
    const status = new URLSearchParams(location.search).get('status') || 'ALL';
    setFilterStatus(status);
  }, [location.search]);

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    if (status === 'ALL') {
      navigate('/missions');
    } else {
      navigate(`/missions?status=${status}`);
    }
  };

  const fetchMissions = async () => {
    try {
      const data = await missionService.getAll();
      setMissions(data);
    } catch (error) {
      console.error("Failed to fetch missions", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' LOCAL');
    };
    const intervalId = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async () => {
    if (!selectedMission) return;
    try {
      await missionService.delete(selectedMission.id);
      fetchMissions();
    } catch (error) {
      console.error("Failed to delete mission", error);
    } finally {
      setIsModalOpen(false);
      setSelectedMission(null);
    }
  };

  return (
    <div className="flex-1 w-full h-full relative z-10">
      <style>
        {`
          .glass-panel {
              background: rgba(18, 19, 22, 0.8);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(0, 210, 255, 0.2);
          }
          .glass-panel-amber {
              background: rgba(18, 19, 22, 0.8);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(254, 170, 0, 0.4);
              box-shadow: 0 0 15px rgba(254, 170, 0, 0.1);
          }
          .glow-cyan { text-shadow: 0 0 8px rgba(0, 210, 255, 0.6); }
          .glow-amber { text-shadow: 0 0 8px rgba(254, 170, 0, 0.6); }
          .scan-line {
              width: 100%;
              height: 2px;
              background: linear-gradient(90deg, transparent, rgba(0, 210, 255, 0.5), transparent);
              animation: scan 3s linear infinite;
          }
          @keyframes scan {
              0% { transform: translateY(-10px); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(20px); opacity: 0; }
          }
        `}
      </style>

      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[32px] md:text-[40px] glow-cyan">target</span>
            ACTIVE OPERATIONS
          </h1>
          <p className="font-data-mono text-data-mono text-outline mt-1 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-surface-tint">{timeString}</span>
          </p>
        </div>

        <div className="flex gap-4">
          {/* Action Buttons */}
          {user?.role === 'ADMIN' && (
            <Link 
              to="/missions/new"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded hover:shadow-lg transition-all glow-border"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              REGISTER OP
            </Link>
          )}

          {/* Filters */}
          <div className="flex gap-2 bg-surface-charcoal border border-glass-border rounded px-2 py-1">
             <button 
               onClick={() => handleFilterChange('ALL')}
               className={`px-3 py-1 text-xs font-label-caps transition-colors ${filterStatus === 'ALL' ? 'text-primary border-b border-primary' : 'text-outline hover:text-on-surface'}`}
             >
               ALL
             </button>
             <button 
               onClick={() => handleFilterChange('EN_PROGRESO')}
               className={`px-3 py-1 text-xs font-label-caps transition-colors ${filterStatus === 'EN_PROGRESO' ? 'text-primary border-b border-primary' : 'text-outline hover:text-on-surface'}`}
             >
               IN PROGRESS
             </button>
             <button 
               onClick={() => handleFilterChange('PENDIENTE')}
               className={`px-3 py-1 text-xs font-label-caps transition-colors ${filterStatus === 'PENDIENTE' ? 'text-primary border-b border-primary' : 'text-outline hover:text-on-surface'}`}
             >
               PENDING
             </button>
             <button 
               onClick={() => handleFilterChange('COMPLETADA')}
               className={`px-3 py-1 text-xs font-label-caps transition-colors ${filterStatus === 'COMPLETADA' ? 'text-primary border-b border-primary' : 'text-outline hover:text-on-surface'}`}
             >
               COMPLETED
             </button>
          </div>
        </div>
      </header>

      {/* Grid Layout for Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max pb-12">
        {isLoading ? (
          <div className="font-data-mono text-primary animate-pulse">LOADING_INTEL...</div>
        ) : missions.length === 0 ? (
          <div className="font-data-mono text-on-surface-variant">NO_ACTIVE_OPERATIONS</div>
        ) : (
          (() => {
            const filteredMissions = missions
              .filter(m => filterStatus === 'ALL' || m.estado === filterStatus)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            
            if (filteredMissions.length === 0) {
              return <div className="font-data-mono text-on-surface-variant col-span-full">NO_MISSIONS_MATCH_FILTER</div>;
            }

            return filteredMissions.map((mission) => {
              const isOmega = mission.nivel_peligro === 'EXTREMO' || mission.nivel_peligro === 'ALTO';
            const panelClass = isOmega ? 'glass-panel-amber' : 'glass-panel group hover:border-primary/50 transition-colors';
            const primaryColor = isOmega ? 'text-secondary-container' : 'text-primary';
            const primaryBg = isOmega ? 'bg-secondary-container' : 'bg-primary';
            const glowClass = isOmega ? 'glow-amber' : 'glow-cyan';
            const icon = isOmega ? 'priority_high' : 'shield';

            return (
              <article key={mission.id} className={`${panelClass} p-5 flex flex-col gap-4 relative overflow-hidden`}>
                <div className="scan-line absolute top-0 left-0"></div>
                {!isOmega && <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>}
                
                <div className={`flex justify-between items-start border-b ${isOmega ? 'border-secondary-container/30' : 'border-glass-border'} pb-3`}>
                  <div>
                    <span className={`font-metadata text-metadata ${primaryColor} ${primaryBg}/10 px-2 py-0.5 border ${isOmega ? 'border-secondary-container/30' : 'border-primary/30'} flex items-center gap-1 w-fit mb-1`}>
                      <span className="material-symbols-outlined text-[10px]">{icon}</span> {mission.nivel_peligro}_THREAT
                    </span>
                    <h2 className="font-data-mono text-[16px] font-bold text-on-surface uppercase tracking-wide line-clamp-2 leading-tight min-h-[2.5rem]">OP: {mission.titulo}</h2>
                    <p className="font-data-mono text-[11px] text-outline">ID: {mission.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <div className={`w-2 h-2 rounded-full ${primaryBg} animate-pulse shadow-[0_0_6px_${isOmega ? 'rgba(254,170,0,0.8)' : 'rgba(0,210,255,0.8)'}]`}></div>
                    <span className={`font-metadata text-metadata ${primaryColor} mt-1`}>{mission.estado}</span>
                    {user?.role === 'ADMIN' && (
                      <button 
                        onClick={() => {
                          setSelectedMission(mission);
                          setIsModalOpen(true);
                        }}
                        className="mt-2 text-error text-[10px] uppercase font-label-caps hover:underline cursor-pointer"
                      >
                        TERMINATE
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
                    {mission.descripcion || "No additional briefing provided."}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 font-data-mono text-[12px] bg-background/50 p-3 border border-technical-gray">
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px]">TARGET LOC:</span>
                    <span className="text-on-surface flex items-center gap-1 mt-0.5 truncate">
                      <span className={`material-symbols-outlined text-[14px] ${primaryColor}`}>location_on</span>
                      {mission.target_location ? `${mission.target_location.city}, ${mission.target_location.country_code}` : 'UNKNOWN_LOC'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px]">DATE:</span>
                    <span className={`text-on-surface flex items-center gap-1 mt-0.5 font-bold ${primaryColor} ${glowClass}`}>
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      {new Date(mission.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between mt-auto pt-3 border-t ${isOmega ? 'border-secondary-container/20' : 'border-glass-border'}`}>
                  <div className="flex items-center gap-2">
                    <img alt="HERO_ASSIGNED" className={`w-8 h-8 rounded border ${isOmega ? 'border-secondary-container/50' : 'border-primary/30'} object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all`} src={mission.hero?.imagen_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDJUxtDJAsXAwyhoijqOEKOWdLg6Godk3Sbp_m6dkC7TZYCPx34aRiwWq50CwROV0Fm-DREmL5a3rioKCGXntcUYc3xyTbCD4I1PMrZPH4R0knWNTYPpUGPGKLOwmq6kfpbLo0Mdqk21IPE0h08xWOMBflmTnFDNS9M5Oj7arCl-9ObsY7LxxSF1Ij5xkTarGgKOCDLSKCMGuY7gET5hQ5IzFwL2vdXUq9ny13MmCIUhWSmW372cRRZ"}/>
                    <div className="flex flex-col">
                      <span className="font-metadata text-metadata text-outline">ASSIGNED_TO:</span>
                      <span className="font-data-mono text-[12px] text-on-surface truncate max-w-[100px]">{mission.hero?.nombre || 'UNASSIGNED'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.role === 'ADMIN' && (
                      <Link to={`/missions/${mission.id}/edit`} className="bg-transparent border border-outline-variant text-outline hover:text-primary hover:border-primary font-label-caps text-label-caps px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer">
                        EDIT
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          });
          })()
        )}
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        itemName={`OP: ${selectedMission?.titulo}`}
      />
    </div>
  );
};
