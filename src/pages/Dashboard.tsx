import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-container-max mx-auto space-y-gutter">
      {/* Personalized Greeting Module */}
      <section className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg p-6 relative overflow-hidden group">
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
            <p className="font-metadata text-metadata text-outline">SECURE_LINK_ESTABLISHED</p>
            <p className="font-data-mono text-data-mono text-on-surface-variant mt-1">LATENCY: 12ms</p>
          </div>
        </div>
      </section>

      {/* Technical Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Metric 1 */}
        <div className="bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-outline group-hover:text-primary transition-colors">TOTAL_ASSETS</span>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">groups</span>
          </div>
          <div className="font-data-mono text-[32px] leading-tight text-on-surface font-bold">
            1,204
          </div>
          <div className="mt-2 h-1 w-full bg-surface-dim rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[85%]"></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-outline group-hover:text-primary transition-colors">TOTAL_MISSIONS</span>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">route</span>
          </div>
          <div className="font-data-mono text-[32px] leading-tight text-on-surface font-bold">
            8,942
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-primary">trending_up</span>
            <span className="font-metadata text-metadata text-primary">+12% THIS_CYCLE</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-outline group-hover:text-primary transition-colors">ACTIVE_OPS</span>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">my_location</span>
          </div>
          <div className="font-data-mono text-[32px] leading-tight text-primary font-bold">
            03
          </div>
          <div className="mt-2 flex gap-1">
            <div className="h-1 flex-1 bg-primary rounded-full animate-pulse"></div>
            <div className="h-1 flex-1 bg-primary rounded-full animate-pulse delay-75"></div>
            <div className="h-1 flex-1 bg-primary rounded-full animate-pulse delay-150"></div>
            <div className="h-1 flex-1 bg-surface-dim rounded-full"></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-4 hover:border-secondary-container/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary-container/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-outline group-hover:text-secondary-container transition-colors">PENDING_PROTOCOLS</span>
            <span className="material-symbols-outlined text-outline group-hover:text-secondary-container transition-colors">warning</span>
          </div>
          <div className="font-data-mono text-[32px] leading-tight text-secondary-container font-bold">
            12
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-metadata text-metadata text-secondary-container">REQUIRES_AUTHORIZATION</span>
          </div>
        </div>
      </section>

      {/* Recent Intelligence (Holographic Grid Table) */}
      <section className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-glass-border/50 flex justify-between items-center bg-technical-gray/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">view_list</span>
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest">RECENT_INTELLIGENCE</h3>
          </div>
          <button className="font-metadata text-metadata text-outline hover:text-primary transition-colors flex items-center gap-1">
            VIEW_ALL <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          </button>
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
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-on-surface-variant">
              {/* Row 1 */}
              <tr className="border-b border-glass-border/10 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-primary group-hover:text-primary-container transition-colors">#AX-992</td>
                <td className="px-6 py-4 text-on-surface font-medium">OMEGA_PROTOCOL</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT border border-primary text-primary bg-primary/10 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> ACTIVE
                  </span>
                </td>
                <td className="px-6 py-4">STARK, ROMANOFF</td>
                <td className="px-6 py-4 text-right text-outline">T-00:02:14</td>
              </tr>
              {/* Row 2 */}
              <tr className="border-b border-glass-border/10 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-primary group-hover:text-primary-container transition-colors">#NX-014</td>
                <td className="px-6 py-4 text-on-surface font-medium">NEBULA_SWEEP</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT border border-secondary-container text-secondary-container bg-secondary-container/10 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span> STANDBY
                  </span>
                </td>
                <td className="px-6 py-4">DANVERS</td>
                <td className="px-6 py-4 text-right text-outline">T-01:45:00</td>
              </tr>
              {/* Row 3 */}
              <tr className="border-b border-glass-border/10 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-primary group-hover:text-primary-container transition-colors">#ZX-771</td>
                <td className="px-6 py-4 text-on-surface font-medium">SHIELD_INTEGRATION</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT border border-outline text-outline bg-surface-dim text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> COMPLETE
                  </span>
                </td>
                <td className="px-6 py-4">ROGERS, WILSON</td>
                <td className="px-6 py-4 text-right text-outline">T-12:00:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
