import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { heroService, type Hero } from '../services/heroService';
import { missionService, type Mission } from '../services/missionService';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroesData, missionsData] = await Promise.all([
          heroService.getAll(),
          missionService.getAll()
        ]);
        setHeroes(heroesData);
        setMissions(missionsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Polling every 15 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async () => {
    if (selectedMission) {
      try {
        await missionService.delete(selectedMission.id);
        setMissions(missions.filter(m => m.id !== selectedMission.id));
      } catch (error) {
        console.error("Failed to delete mission", error);
      } finally {
        setIsModalOpen(false);
        setSelectedMission(null);
      }
    }
  };

  const totalAssets = heroes.length;
  const totalMissions = missions.length;
  const activeOps = missions.filter(m => m.estado === 'EN_PROGRESO').length;
  const pendingMissions = missions.filter(m => m.estado === 'PENDIENTE').length;
  const recentMissions = [...missions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_PROGRESO': return { bg: 'bg-primary/10', border: 'border-primary', text: 'text-primary', dot: 'bg-primary' };
      case 'COMPLETADA': return { bg: 'bg-surface-dim', border: 'border-outline', text: 'text-outline', dot: 'bg-outline' };
      case 'PENDIENTE': return { bg: 'bg-secondary-container/10', border: 'border-secondary-container', text: 'text-secondary-container', dot: 'bg-secondary-container' };
      case 'CANCELADA': return { bg: 'bg-error/10', border: 'border-error', text: 'text-error', dot: 'bg-error' };
      default: return { bg: 'bg-surface-dim', border: 'border-outline', text: 'text-outline', dot: 'bg-outline' };
    }
  };

  if (isLoading) {
    return <div className="max-w-container-max mx-auto text-primary font-data-mono animate-pulse pt-10">ACCESSING_SECURE_RECORDS...</div>;
  }

  // Chart Data Preparation
  const statusData = [
    { name: 'PENDIENTE', value: pendingMissions },
    { name: 'EN PROGRESO', value: activeOps },
    { name: 'COMPLETADA', value: missions.filter(m => m.estado === 'COMPLETADA').length },
  ];

  const COLORS = ['#94a3b8', '#00d2ff', '#feaa00']; // outline, primary, secondary-container (roughly)

  // Group missions by date for line chart
  const missionsByDate = missions.reduce((acc, mission) => {
    const date = new Date(mission.fecha).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.keys(missionsByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map(date => ({
    date,
    count: missionsByDate[date]
  }));

  return (
    <div className="max-w-container-max mx-auto space-y-gutter">
      {/* Personalized Greeting Module */}
      <section className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg p-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full overflow-hidden h-full pointer-events-none z-0"><div className="scan-line"></div></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight mb-1">
              Welcome back, {user?.name || 'Operator-01'}.
            </h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-data-mono text-data-mono text-primary-fixed-dim uppercase tracking-wider">
                System Status: <span className="text-primary font-bold">OPTIMAL</span>
              </span>
            </div>
          </div>
          <div className="text-right">
          </div>
        </div>
      </section>

      {/* Technical Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Metric 1 */}
        <div onClick={() => navigate('/heroes')} className="cursor-pointer bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden h-full pointer-events-none z-0"><div className="scan-line"></div></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-outline group-hover:text-primary transition-colors">TOTAL_ASSETS</span>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">groups</span>
          </div>
          <div className="font-data-mono text-[32px] leading-tight text-on-surface font-bold">
            {totalAssets}
          </div>
          <div className="mt-2 h-1 w-full bg-surface-dim rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{width: `${Math.min(100, (totalAssets / 50) * 100)}%`}}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div onClick={() => navigate('/missions')} className="cursor-pointer bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden h-full pointer-events-none z-0"><div className="scan-line"></div></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-outline group-hover:text-primary transition-colors">TOTAL_MISSIONS</span>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">route</span>
          </div>
          <div className="font-data-mono text-[32px] leading-tight text-on-surface font-bold">
            {totalMissions}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-primary">trending_up</span>
            <span className="font-metadata text-metadata text-primary">LIVE TRACKING</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div onClick={() => navigate('/missions?status=EN_PROGRESO')} className="cursor-pointer bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden h-full pointer-events-none z-0"><div className="scan-line"></div></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-outline group-hover:text-primary transition-colors">ACTIVE_OPS</span>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">my_location</span>
          </div>
          <div className="font-data-mono text-[32px] leading-tight text-primary font-bold">
            {activeOps.toString().padStart(2, '0')}
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: Math.max(4, activeOps) }).slice(0, 8).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i < activeOps ? 'bg-primary animate-pulse' : 'bg-surface-dim'}`}></div>
            ))}
          </div>
        </div>

        {/* Metric 4 */}
        <div onClick={() => navigate('/missions?status=PENDIENTE')} className="cursor-pointer bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-secondary-container/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden h-full pointer-events-none z-0"><div className="scan-line"></div></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary-container/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-outline group-hover:text-secondary-container transition-colors">PENDING_PROTOCOLS</span>
            <span className="material-symbols-outlined text-outline group-hover:text-secondary-container transition-colors">warning</span>
          </div>
          <div className="font-data-mono text-[32px] leading-tight text-secondary-container font-bold">
            {pendingMissions.toString().padStart(2, '0')}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-metadata text-metadata text-secondary-container">{pendingMissions > 0 ? 'REQUIRES_AUTHORIZATION' : 'ALL_CLEAR'}</span>
          </div>
        </div>
      </section>

      {/* Real-Time Metrics Visualization */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-8">
        <div className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden h-full pointer-events-none z-0"><div className="scan-line"></div></div>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest">OPERATION TRENDS</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 210, 255, 0.2)', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#00d2ff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#00d2ff" strokeWidth={2} dot={{ fill: '#00d2ff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full overflow-hidden h-full pointer-events-none z-0"><div className="scan-line"></div></div>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-sm">donut_large</span>
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest">STATUS DISTRIBUTION</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 210, 255, 0.2)', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="font-metadata text-metadata text-outline">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Intelligence (Holographic Grid Table) */}
      <section className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full overflow-hidden h-full pointer-events-none z-0"><div className="scan-line"></div></div>
        <div className="px-6 py-4 border-b border-glass-border/50 flex justify-between items-center bg-technical-gray/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">view_list</span>
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest">RECENT_INTELLIGENCE</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border/30 bg-surface-dim/50">
                <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal">OP_ID</th>
                <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal">OPERATION_TITLE</th>
                <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal">STATUS</th>
                <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal">ASSIGNED_OPERATIVES</th>
                <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal text-right">LAST_UPDATE</th>
                <th className="px-6 py-3 font-metadata text-metadata text-outline font-normal text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-on-surface-variant">
              {recentMissions.map((mission) => {
                const statusTheme = getStatusColor(mission.estado);
                const assignedHero = heroes.find(h => h.id === mission.superheroe_id);
                
                return (
                  <tr key={mission.id} className="border-b border-glass-border/10 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-primary group-hover:text-primary-container transition-colors">#OP-{mission.id.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-on-surface font-medium">{mission.titulo}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT border ${statusTheme.border} ${statusTheme.text} ${statusTheme.bg} text-[11px]`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusTheme.dot} ${mission.estado === 'EN_PROGRESO' ? 'animate-pulse' : ''}`}></span> {mission.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">{assignedHero ? assignedHero.nombre.toUpperCase() : 'UNASSIGNED'}</td>
                    <td className="px-6 py-4 text-right text-outline">{new Date(mission.updated_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/missions#mission-${mission.id}`)}
                          className="p-1.5 rounded bg-surface-container-highest hover:bg-primary/20 text-outline hover:text-primary transition-colors group-hover:border-primary/30 border border-transparent"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        
                        {user?.role === 'ADMIN' && (
                          <>
                            <Link 
                              to={`/missions/${mission.id}/edit`}
                              className="p-1.5 rounded bg-surface-container-highest hover:bg-secondary-container/20 text-outline hover:text-secondary-container transition-colors group-hover:border-secondary-container/30 border border-transparent"
                              title="Edit Op"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </Link>
                            <button 
                              onClick={() => {
                                setSelectedMission(mission);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded bg-surface-container-highest hover:bg-error/20 text-outline hover:text-error transition-colors group-hover:border-error/30 border border-transparent"
                              title="Terminate Op"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {recentMissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-outline">NO RECORDS FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        itemName={`OP: ${selectedMission?.titulo}`}
      />
    </div>
  );
};
