import React from 'react';
import { Link } from 'react-router-dom';

export const HeroNetwork: React.FC = () => {
  return (
    <div className="max-w-container-max mx-auto pb-24">
      {/* Header & Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-glass-border pb-4">
          <div>
            <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tighter uppercase">Personnel Dossiers</h1>
            <p className="font-data-mono text-data-mono text-on-surface-variant">SECURE CLASSIFIED DATABASE // ACTIVE ROSTER</p>
          </div>
          <div className="w-full md:w-96 relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full bg-surface-lowest border border-technical-gray text-on-surface font-data-mono text-data-mono pl-10 pr-4 py-2 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-outline/50 bg-black/50 backdrop-blur-md" 
              placeholder="SCAN_OPERATIVES..." 
              type="text" 
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button className="p-1 hover:text-primary text-outline transition-colors">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
              </button>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button className="font-data-mono text-metadata px-3 py-1 rounded border border-primary text-primary bg-primary/10">ALL_STATUS</button>
          <button className="font-data-mono text-metadata px-3 py-1 rounded border border-technical-gray text-outline hover:border-primary/50 hover:text-primary transition-colors bg-black/40 backdrop-blur-sm">ACTIVE</button>
          <button className="font-data-mono text-metadata px-3 py-1 rounded border border-technical-gray text-outline hover:border-primary/50 hover:text-primary transition-colors bg-black/40 backdrop-blur-sm">STANDBY</button>
          <button className="font-data-mono text-metadata px-3 py-1 rounded border border-technical-gray text-outline hover:border-primary/50 hover:text-primary transition-colors bg-black/40 backdrop-blur-sm">COVERT</button>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Card 1: Iron Man */}
        <Link to="/heroes/1" className="block">
          <article className="relative bg-surface-charcoal border border-glass-border rounded-lg overflow-hidden group hover:border-primary/60 transition-all duration-300">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 scan-line z-20 pointer-events-none"></div>
            <div className="relative h-64 overflow-hidden border-b border-glass-border">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal" 
                alt="Iron Man Helmet" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAfQWN9tiQ0bvTT7IEP1tALNwpsB1gCusw-5Y7VERnlRtr2kcFGt6uBTDta_BPsV0pY84POUiP6zzL_K99KkFdzw_woJODSHE7zbPz9iHOZKD3tRGT6_G2o0D4Q-kTFJfIPCbqRo0ZTMydh7eWgn0k0nnxHTpAjNb4x5wgQ75Rz6qKpPaMTRUc5perDfVWExOxANYtUDnPgVj5yQCHx2KBMAF-pNUxYHH9V_zwbF_EiwYqJfMoRedl" 
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-primary/30 px-2 py-0.5 rounded font-data-mono text-metadata text-primary flex items-center gap-1 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> ACTIVE
              </div>
              <div className="absolute top-2 right-2 font-data-mono text-metadata text-outline/70 bg-black/50 px-1 rounded z-10">ID: STK-001</div>
            </div>
            
            <div className="p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-display-lg text-headline-lg-mobile text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">IRON MAN</h2>
                  <p className="font-data-mono text-metadata text-outline">ANTHONY EDWARD STARK</p>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px] opacity-70 group-hover:opacity-100">rocket_launch</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                <div>
                  <div className="font-data-mono text-[10px] text-outline mb-1">AFFILIATION</div>
                  <div className="font-data-mono text-data-mono text-on-surface-variant">AVENGERS</div>
                </div>
                <div>
                  <div className="font-data-mono text-[10px] text-outline mb-1">CLEARANCE</div>
                  <div className="font-data-mono text-data-mono text-secondary-container">OMEGA_LEVEL</div>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-glass-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-data-mono text-metadata text-outline">POWER_SYS_CAPACITY</span>
                  <span className="font-data-mono text-metadata text-primary">98.4%</span>
                </div>
                <div className="h-1 w-full bg-technical-gray rounded-full overflow-hidden border border-glass-border/50">
                  <div className="h-full bg-primary w-[98%]" style={{boxShadow: "0 0 8px rgba(0,210,255,0.8)"}}></div>
                </div>
              </div>
            </div>
          </article>
        </Link>

        {/* Card 2: Captain America */}
        <Link to="/heroes/2" className="block">
          <article className="relative bg-surface-charcoal border border-technical-gray rounded-lg overflow-hidden group hover:border-primary/40 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-outline/20 to-transparent z-20"></div>
            <div className="relative h-64 overflow-hidden border-b border-technical-gray/50">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity group-hover:opacity-80" 
                alt="Captain America Shield" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqTe-K40W_y59zoDSWgE0R6x2tMdlMuhrBRCB2LkT6s7UhFBW9qlMEA-WPuk28R3yGh2KXRWrl4HqSe3n6W9jlJ0ji02kMS2RA-GkAhW4yoyV6H9N0qj9wsLiSidSR8O1tGVfI3GxlQZGRCVSem-H3OVnCeNJ27ed5p_r_GgKDan9k6Tpix2N565LN-Gx84iaG7uObdO6LxGqtNDYJuRVze1_2aqCPBUUJDshwf8ZvKTKQ2Ab89IJm" 
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-technical-gray px-2 py-0.5 rounded font-data-mono text-metadata text-outline flex items-center gap-1 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> STANDBY
              </div>
              <div className="absolute top-2 right-2 font-data-mono text-metadata text-outline/70 bg-black/50 px-1 rounded z-10">ID: RGR-001</div>
            </div>
            
            <div className="p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-display-lg text-headline-lg-mobile text-on-surface uppercase tracking-tight group-hover:text-primary-container transition-colors">CAPTAIN AMERICA</h2>
                  <p className="font-data-mono text-metadata text-outline">STEVEN GRANT ROGERS</p>
                </div>
                <span className="material-symbols-outlined text-outline text-[28px] group-hover:text-primary-container transition-colors">shield</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                <div>
                  <div className="font-data-mono text-[10px] text-outline mb-1">AFFILIATION</div>
                  <div className="font-data-mono text-data-mono text-on-surface-variant">AVENGERS / S.H.I.E.L.D.</div>
                </div>
                <div>
                  <div className="font-data-mono text-[10px] text-outline mb-1">CLEARANCE</div>
                  <div className="font-data-mono text-data-mono text-tertiary">LEVEL_8</div>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-technical-gray/30 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-data-mono text-metadata text-outline">COMBAT_READINESS</span>
                  <span className="font-data-mono text-metadata text-outline">100.0%</span>
                </div>
                <div className="h-1 w-full bg-technical-gray rounded-full overflow-hidden border border-technical-gray/50">
                  <div className="h-full bg-outline w-full"></div>
                </div>
              </div>
            </div>
          </article>
        </Link>

        {/* Card 3: Black Widow */}
        <Link to="/heroes/3" className="block">
          <article className="relative bg-surface-charcoal border border-technical-gray rounded-lg overflow-hidden group hover:border-secondary-container/40 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary-container/20 to-transparent z-20"></div>
            <div className="relative h-64 overflow-hidden border-b border-technical-gray/50">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50 mix-blend-luminosity group-hover:opacity-70" 
                alt="Tactical Espionage Gear" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnANef1Z5DC2KSkfHfkrPUO7Bs5PCTqQ_cIgILB4sWEtQtiHY1GI8LCUrm2_k-Uyvk9uCBxJbtqTIGwvrvzPnh0JNs-G0NkdNip2cE617QJ06WAkY99w9or_tLQ7nugV4comiiKzRt64raXI5DuvBgLhqGwjTyFRfMuTKw5MHCAmDRD5zuSP5Hkbu-oq2AeSx4qpbqdgFSUf_YMl2nmDKZOO5mNCnCgbxKKtYaiX3SREhCoZ1l7Lbz" 
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-secondary-container/30 px-2 py-0.5 rounded font-data-mono text-metadata text-secondary-container flex items-center gap-1 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span> COVERT
              </div>
              <div className="absolute top-2 right-2 font-data-mono text-metadata text-outline/70 bg-black/50 px-1 rounded z-10">ID: RMN-001</div>
            </div>
            
            <div className="p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-display-lg text-headline-lg-mobile text-on-surface uppercase tracking-tight group-hover:text-secondary-container transition-colors">BLACK WIDOW</h2>
                  <p className="font-data-mono text-metadata text-outline">NATALIA ALIANOVNA ROMANOVA</p>
                </div>
                <span className="material-symbols-outlined text-secondary-container text-[28px] opacity-70 group-hover:opacity-100">visibility_off</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                <div>
                  <div className="font-data-mono text-[10px] text-outline mb-1">AFFILIATION</div>
                  <div className="font-data-mono text-data-mono text-on-surface-variant">UNKNOWN / CLASSIFIED</div>
                </div>
                <div>
                  <div className="font-data-mono text-[10px] text-outline mb-1">CLEARANCE</div>
                  <div className="font-data-mono text-data-mono text-error">LEVEL_10</div>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-technical-gray/30 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-data-mono text-metadata text-outline">SIGNAL_INTEGRITY</span>
                  <span className="font-data-mono text-metadata text-secondary-container">14.2% [ENCRYPTED]</span>
                </div>
                <div className="h-1 w-full bg-technical-gray rounded-full overflow-hidden border border-technical-gray/50">
                  <div className="h-full bg-secondary-container w-[14%]" style={{boxShadow: "0 0 8px rgba(254,170,0,0.5)"}}></div>
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>
    </div>
  );
};
