import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const MissionList: React.FC = () => {
  const [timeString, setTimeString] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<string | undefined>();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toISOString().split('T')[1].slice(0, 8) + ' UTC');
    };
    const intervalId = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(intervalId);
  }, []);

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
            LIVE TACTICAL OVERVIEW // <span className="text-surface-tint">{timeString}</span>
          </p>
        </div>

        <div className="flex gap-4">
          {/* Action Buttons */}
          <Link 
            to="/missions/new"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded hover:shadow-lg transition-all glow-border"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            REGISTER OP
          </Link>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 font-label-caps text-label-caps uppercase bg-surface-charcoal p-1 border border-outline-variant rounded">
          <button className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/50 shadow-[0_0_8px_rgba(0,210,255,0.2)] transition-all">ACTIVE</button>
          <button className="px-4 py-1.5 text-outline hover:text-primary transition-colors border border-transparent hover:border-outline-variant">STANDBY</button>
          <button className="px-4 py-1.5 text-outline hover:text-primary transition-colors border border-transparent hover:border-outline-variant">ARCHIVED</button>
          <div className="w-px h-4 bg-outline-variant mx-1"></div>
          <button className="px-4 py-1.5 text-secondary-container flex items-center gap-1 hover:bg-secondary-container/10 transition-colors border border-transparent hover:border-secondary-container/30">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            THREAT_LEVEL
          </button>
        </div>
        </div>
      </header>

      {/* Grid Layout for Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max pb-12">
        
        {/* Mission Card: OMEGA Level (Amber) */}
        <article className="glass-panel-amber p-5 flex flex-col gap-4 relative overflow-hidden group">
          <div className="scan-line absolute top-0 left-0"></div>
          
          <div className="flex justify-between items-start border-b border-secondary-container/30 pb-3">
            <div>
              <span className="font-metadata text-metadata text-secondary-container bg-secondary-container/10 px-2 py-0.5 border border-secondary-container/30 flex items-center gap-1 w-fit mb-1">
                <span className="material-symbols-outlined text-[10px]">priority_high</span> OMEGA_THREAT
              </span>
              <h2 className="font-data-mono text-[16px] font-bold text-on-surface uppercase tracking-wide">OP: BLACK_ECHO</h2>
              <p className="font-data-mono text-[11px] text-outline">ID: 994-OMEGA-X</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-2 h-2 rounded-full bg-secondary-container animate-pulse shadow-[0_0_6px_rgba(254,170,0,0.8)]"></div>
              <span className="font-metadata text-metadata text-secondary-container mt-1">CRITICAL</span>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
              Anomalous energy spikes detected in Sector 7 sub-levels. Unknown hostile entity compromising structural integrity. Immediate neutralization required to prevent cascade failure.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 font-data-mono text-[12px] bg-background/50 p-3 border border-technical-gray">
            <div className="flex flex-col">
              <span className="text-outline text-[10px]">TARGET LOC:</span>
              <span className="text-on-surface flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-secondary-container">location_on</span>
                SECTOR_7_DEEP
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-outline text-[10px]">T-MINUS:</span>
              <span className="text-on-surface flex items-center gap-1 mt-0.5 font-bold text-secondary-container glow-amber">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                00:14:59
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-secondary-container/20">
            <div className="flex items-center gap-2">
              <img alt="HERO_ASSIGNED" className="w-8 h-8 rounded border border-secondary-container/50 object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuVwgDJTEHZKwwPbcuPqZvKybhFNWCVhou1_Qvko5D2TgV0fNWWeYWuHxmkw9eWTVWeBzGd1smD0IvQHLK7EzKdV94lUccf3uFeNyZ6y1RJX2kh2sVfwop8K0tLMqfqEf0JQPN38o1WDh9S9XaoeXBS2pnbJvtLYskK7DIExteixUD_5fQUPgfiGh-8OvBueTWPR1YSlTRqrugNOuiq9TzZCbMXAY5pD0LQ3nHAtskGNwbiEU_zz59"/>
              <div className="flex flex-col">
                <span className="font-metadata text-metadata text-outline">ASSIGNED_TO:</span>
                <span className="font-data-mono text-[12px] text-on-surface">UNIT_VANGUARD</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/missions/994-OMEGA-X/edit" className="bg-transparent border border-outline-variant text-outline hover:text-primary hover:border-primary font-label-caps text-label-caps px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer">
                EDIT
              </Link>
              <button className="bg-secondary-container/10 border border-secondary-container text-secondary-container hover:bg-secondary-container hover:text-black font-label-caps text-label-caps px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer">
                VIEW_INTEL
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </article>

        {/* Mission Card: Standard Level (Cyan) */}
        <article className="glass-panel p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div className="flex justify-between items-start border-b border-glass-border pb-3">
            <div>
              <span className="font-metadata text-metadata text-primary bg-primary/10 px-2 py-0.5 border border-primary/30 flex items-center gap-1 w-fit mb-1">
                <span className="material-symbols-outlined text-[10px]">check_circle</span> ACTIVE_STANDARD
              </span>
              <h2 className="font-data-mono text-[16px] font-bold text-on-surface uppercase tracking-wide">OP: SILENT_DAWN</h2>
              <p className="font-data-mono text-[11px] text-outline">ID: 412-ALPHA-S</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(0,210,255,0.8)]"></div>
              <span className="font-metadata text-metadata text-primary mt-1">PROCESSING</span>
              <button 
                onClick={() => {
                  setSelectedMission('OP: SILENT_DAWN');
                  setIsModalOpen(true);
                }}
                className="mt-2 text-error text-[10px] uppercase font-label-caps hover:underline cursor-pointer"
              >
                TERMINATE
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
              Routine perimeter sweep and network diagnostics of the outer array. Signal interference detected, likely atmospheric, but requires physical verification of relay nodes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 font-data-mono text-[12px] bg-background/50 p-3 border border-technical-gray">
            <div className="flex flex-col">
              <span className="text-outline text-[10px]">TARGET LOC:</span>
              <span className="text-on-surface flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                OUTER_ARRAY_N
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-outline text-[10px]">EST_COMPLETION:</span>
              <span className="text-on-surface flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-outline">schedule</span>
                04H_30M
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-[2px] bg-technical-gray border border-outline-variant/30 mt-1 mb-1">
            <div className="h-full bg-primary w-[65%] shadow-[0_0_8px_rgba(0,210,255,0.5)] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white shadow-[0_0_4px_#fff]"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-glass-border">
            <div className="flex items-center gap-2">
              <img alt="HERO_ASSIGNED" className="w-8 h-8 rounded border border-primary/30 object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJUxtDJAsXAwyhoijqOEKOWdLg6Godk3Sbp_m6dkC7TZYCPx34aRiwWq50CwROV0Fm-DREmL5a3rioKCGXntcUYc3xyTbCD4I1PMrZPH4R0knWNTYPpUGPGKLOwmq6kfpbLo0Mdqk21IPE0h08xWOMBflmTnFDNS9M5Oj7arCl-9ObsY7LxxSF1Ij5xkTarGgKOCDLSKCMGuY7gET5hQ5IzFwL2vdXUq9ny13MmCIUhWSmW372cRRZ"/>
              <div className="flex flex-col">
                <span className="font-metadata text-metadata text-outline">ASSIGNED_TO:</span>
                <span className="font-data-mono text-[12px] text-on-surface">SCOUT_PHANTOM</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/missions/412-ALPHA-S/edit" className="bg-transparent border border-outline-variant text-outline hover:text-primary hover:border-primary font-label-caps text-label-caps px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer">
                EDIT
              </Link>
              <button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-caps text-label-caps px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer">
                MONITOR
                <span className="material-symbols-outlined text-[14px]">visibility</span>
              </button>
            </div>
          </div>
        </article>

      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          // additional logic...
        }}
        itemName={selectedMission}
      />
    </div>
  );
};
