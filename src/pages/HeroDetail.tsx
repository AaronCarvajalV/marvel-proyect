import React from 'react';

export const HeroDetail: React.FC = () => {
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
          .hud-border-active {
              border: 1px solid #47d6ff;
              box-shadow: 0 0 4px rgba(0, 210, 255, 0.4), inset 0 0 10px rgba(0, 210, 255, 0.1);
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
                <span className="font-metadata text-metadata text-primary bg-primary/10 px-2 py-1 rounded-DEFAULT border border-glass-border">ID: AX-7749-V</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="font-data-mono text-data-mono text-on-surface-variant">
                  CLASS: <span className="text-primary">INFILTRATOR</span>
                </div>
                <span className="material-symbols-outlined text-primary/50 text-xl group-hover:text-primary transition-colors">fingerprint</span>
              </div>
            </div>
            
            <div className="absolute top-1/4 left-0 w-full scan-line z-20 animate-[scan_3s_ease-in-out_infinite]"></div>
            <img 
              alt="Operative Profile" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity filter contrast-125" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9VRvV6dkrZIwUxmVumjm_bnhapt2aUbmMd7OTf4RapUAx6f1teITuMDmYqQBm9WGvF5ZRhECCH1Ornn_1GegyXOiGsORjM-YUnFl2afkzzfEDDDjLkUJ2UezbWRLzGLzKzsuhg8pRLuc7p8ycP8a2CCQWBIp3ERTO5k_3rDIMrC9j1Z0Dqz8PBQSLLF1wHMJqzExA7q9HUuaJCbABVp_WAzoOIrbehz8X3oyYB8lWyNFPhIvLbGgb" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-charcoal via-transparent to-surface-charcoal/40 z-10"></div>
          </div>
          
          {/* Threat Assessment Card */}
          <div className="bg-surface-charcoal/90 backdrop-blur-lg rounded-lg hud-border p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-glass-border pb-2">
              <span className="material-symbols-outlined text-secondary-container text-sm">warning</span>
              <h3 className="font-data-mono text-data-mono text-secondary-container">THREAT_ASSESSMENT</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-on-surface alert-glow">LEVEL_ALPHA</div>
                <div className="font-metadata text-metadata text-on-surface-variant mt-1">LETHAL_RESPONSE_AUTHORIZED</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-secondary-container font-data-mono text-data-mono">98.4%</div>
                <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden border border-glass-border">
                  <div className="h-full bg-secondary-container w-[98.4%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Data & Actions */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          {/* Header Area */}
          <div className="flex flex-col gap-2 border-b border-glass-border pb-4">
            <div className="font-data-mono text-data-mono text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              OPERATIVE_PROFILE
            </div>
            <h1 className="font-display-lg text-[40px] md:text-display-lg text-on-surface leading-none tracking-tight">
              Kaelen <span className="text-primary text-glow">"GHOST"</span> Vance
            </h1>
            <div className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-2">
              Elite specialist in deep-cover infiltration and tactical sabotage. Extensive cybernetic augments localized to neural processing and optical cloaking arrays. Currently unassigned.
            </div>
          </div>
          
          {/* Grid Layout for Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bio Stats */}
            <div className="bg-surface-charcoal/80 backdrop-blur-lg rounded-lg hud-border p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-glass-border pb-2">
                <span className="material-symbols-outlined text-primary text-sm">monitor_heart</span>
                <h3 className="font-data-mono text-data-mono text-primary">BIO_STATS</h3>
              </div>
              <div className="flex flex-col gap-3">
                {/* Stat Row */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-metadata text-metadata">
                    <span className="text-on-surface-variant">NEURAL_SYNC</span>
                    <span className="text-primary">92.4%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest border border-glass-border/50">
                    <div className="h-full bg-primary w-[92.4%]"></div>
                  </div>
                </div>
                {/* Stat Row */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-metadata text-metadata">
                    <span className="text-on-surface-variant">CLOAKING_RESERVE</span>
                    <span className="text-primary">85.0%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest border border-glass-border/50">
                    <div className="h-full bg-primary w-[85%]"></div>
                  </div>
                </div>
                {/* Stat Row */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-metadata text-metadata">
                    <span className="text-on-surface-variant">CORTICAL_STRESS</span>
                    <span className="text-secondary-container">41.2%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest border border-glass-border/50">
                    <div className="h-full bg-secondary-container w-[41.2%]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Operational Status */}
            <div className="bg-surface-charcoal/80 backdrop-blur-lg rounded-lg hud-border p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-glass-border pb-2">
                <span className="material-symbols-outlined text-primary text-sm">radar</span>
                <h3 className="font-data-mono text-data-mono text-primary">OPERATIONAL_STATUS</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-DEFAULT border border-glass-border/30">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(0,210,255,0.8)]"></div>
                  <div>
                    <div className="font-label-caps text-label-caps text-on-surface">READY_FOR_DEPLOYMENT</div>
                    <div className="font-metadata text-metadata text-on-surface-variant">LOC: SECTOR_7G_ORBITAL</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 font-metadata text-metadata">
                  <div className="bg-surface-container-highest p-2 rounded-DEFAULT border border-glass-border/20">
                    <span className="text-on-surface-variant block mb-1">CLEARANCE</span>
                    <span className="text-primary">LEVEL_5</span>
                  </div>
                  <div className="bg-surface-container-highest p-2 rounded-DEFAULT border border-glass-border/20">
                    <span className="text-on-surface-variant block mb-1">LAST_SYNC</span>
                    <span className="text-primary">04:22:11_UTC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mission History */}
          <div className="bg-surface-charcoal/80 backdrop-blur-lg rounded-lg hud-border flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-glass-border p-4 bg-surface-charcoal/90">
              <span className="material-symbols-outlined text-primary text-sm">history</span>
              <h3 className="font-data-mono text-data-mono text-primary">MISSION_HISTORY</h3>
            </div>
            <div className="p-4 flex flex-col gap-2 overflow-y-auto">
              {/* History Item */}
              <div className="flex items-center justify-between p-3 bg-surface-container-highest/50 border border-glass-border/30 rounded-DEFAULT hover:border-primary/50 hover:bg-white/5 transition-colors cursor-default group">
                <div className="flex items-center gap-4">
                  <div className="font-data-mono text-data-mono text-on-surface-variant w-20">OP_ECHO</div>
                  <div className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Data Extraction Facility 4</div>
                </div>
                <div className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-1 rounded-DEFAULT border border-primary/20">SUCCESS</div>
              </div>
              {/* History Item */}
              <div className="flex items-center justify-between p-3 bg-surface-container-highest/50 border border-glass-border/30 rounded-DEFAULT hover:border-primary/50 hover:bg-white/5 transition-colors cursor-default group">
                <div className="flex items-center gap-4">
                  <div className="font-data-mono text-data-mono text-on-surface-variant w-20">OP_NULL</div>
                  <div className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Target Neutralization</div>
                </div>
                <div className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-1 rounded-DEFAULT border border-primary/20">SUCCESS</div>
              </div>
              {/* History Item */}
              <div className="flex items-center justify-between p-3 bg-surface-container-highest/50 border border-glass-border/30 rounded-DEFAULT hover:border-primary/50 hover:bg-white/5 transition-colors cursor-default group">
                <div className="flex items-center gap-4">
                  <div className="font-data-mono text-data-mono text-on-surface-variant w-20">OP_VOID</div>
                  <div className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Asset Recovery</div>
                </div>
                <div className="font-label-caps text-label-caps text-secondary-container bg-secondary-container/10 px-2 py-1 rounded-DEFAULT border border-secondary-container/20">PARTIAL</div>
              </div>
            </div>
          </div>
          
          {/* Action Area */}
          <div className="mt-auto flex justify-end pt-4 border-t border-glass-border">
            <button className="bg-primary text-surface-container-lowest font-label-caps text-label-caps px-8 py-4 rounded-DEFAULT hover:bg-primary-container hover:shadow-[0_0_15px_rgba(0,210,255,0.6)] transition-all active:scale-95 flex items-center gap-2 group">
              <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">rocket_launch</span>
              DEPLOY_OPERATIVE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
