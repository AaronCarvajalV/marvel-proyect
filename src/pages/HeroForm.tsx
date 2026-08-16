import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [combat, setCombat] = useState(85);
  const [stealth, setStealth] = useState(60);
  const [tech, setTech] = useState(92);
  
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission and redirect back to heroes list
    navigate('/heroes');
  };

  return (
    <>
      <style>
        {`
          .tech-input:focus {
              outline: none;
              border-color: #a5e7ff;
              box-shadow: 0 0 4px rgba(0, 210, 255, 0.4);
          }
          .tech-input:focus + label,
          .tech-input:focus ~ .input-glow {
              color: #a5e7ff;
              text-shadow: 0 0 8px rgba(0, 210, 255, 0.6);
          }
          .drag-active {
              border-color: #a5e7ff !important;
              background-color: rgba(0, 210, 255, 0.1) !important;
          }
          .slider-tech {
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: #2a2d33;
            outline: none;
          }
          .slider-tech::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #a5e7ff;
            cursor: pointer;
          }
          .slider-tech::-moz-range-thumb {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #a5e7ff;
            cursor: pointer;
          }
        `}
      </style>

      <div className="max-w-container-max mx-auto pb-12 w-full relative z-10">
        {/* Header */}
        <div className="mb-8 border-b border-glass-border pb-4 relative">
          <div className="absolute bottom-0 left-0 h-[1px] w-1/3 bg-primary/50" style={{boxShadow: "0 0 8px rgba(0, 210, 255, 0.8)"}}></div>
          <h1 className="font-display-lg text-display-lg md:text-display-lg text-on-surface mb-2 tracking-tight">REGISTER_OPERATIVE</h1>
          <div className="flex items-center gap-4 text-on-surface-variant font-data-mono text-data-mono">
            <span className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[16px]">fingerprint</span> SECURE_UPLINK
            </span>
            <span>//</span>
            <span>PERSONNEL DOSSIER INITIALIZATION</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter md:gap-6">
          {/* Left Column: Identity & Metadata (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Section 1: Basic Identity */}
            <div className="bg-surface-charcoal/80 border border-technical-gray p-6 relative">
              {/* Top left corner deco */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
              
              <div className="flex items-center gap-2 mb-6 border-b border-technical-gray pb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <h2 className="font-data-mono text-data-mono text-primary uppercase tracking-widest">IDENTITY_PARAMETERS</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative flex flex-col group">
                  <label className="font-metadata text-metadata text-on-surface-variant uppercase mb-1 group-focus-within:text-primary transition-colors">DESIGNATION (CALLSIGN)</label>
                  <input className="tech-input bg-[#0a0a0c] border border-technical-gray text-on-surface font-data-mono text-data-mono px-4 py-2 w-full transition-all" placeholder="E.G. SPECTER_09" required type="text"/>
                </div>
                
                <div className="relative flex flex-col group">
                  <label className="font-metadata text-metadata text-on-surface-variant uppercase mb-1 group-focus-within:text-primary transition-colors">LEGAL IDENTIFIER (REAL NAME)</label>
                  <input className="tech-input bg-[#0a0a0c] border border-technical-gray text-on-surface font-data-mono text-data-mono px-4 py-2 w-full transition-all" placeholder="REDACTED_BY_DEFAULT" type="text"/>
                </div>
                
                <div className="relative flex flex-col group md:col-span-2">
                  <label className="font-metadata text-metadata text-on-surface-variant uppercase mb-1 group-focus-within:text-primary transition-colors">CLEARANCE LEVEL</label>
                  <select className="tech-input bg-[#0a0a0c] border border-technical-gray text-on-surface font-data-mono text-data-mono px-4 py-2 w-full appearance-none transition-all cursor-pointer">
                    <option value="1">LEVEL 1 - STANDARD INFILTRATION</option>
                    <option value="2">LEVEL 2 - TACTICAL COMMAND</option>
                    <option value="3">LEVEL 3 - STRATEGIC OVERSIGHT</option>
                    <option value="4">LEVEL 4 - OMNI_ACCESS (RESTRICTED)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-7 text-on-surface-variant pointer-events-none">arrow_drop_down</span>
                </div>
              </div>
            </div>
            
            {/* Section 2: Power Metrics & Sliders */}
            <div className="bg-surface-charcoal/80 border border-technical-gray p-6 relative">
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
              
              <div className="flex items-center gap-2 mb-6 border-b border-technical-gray pb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                <h2 className="font-data-mono text-data-mono text-primary uppercase tracking-widest">METRIC_CALIBRATION</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                {/* Slider 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between font-metadata text-metadata uppercase">
                    <span className="text-on-surface-variant">COMBAT_PROBABILITY</span>
                    <span className="text-primary">{combat}%</span>
                  </div>
                  <input 
                    className="w-full h-1 bg-surface-container-highest appearance-none cursor-pointer outline-none slider-tech" 
                    max="100" min="0" type="range" value={combat} onChange={(e) => setCombat(parseInt(e.target.value))}
                    style={{ background: `linear-gradient(to right, #a5e7ff ${combat}%, #2a2d33 ${combat}%)` }}
                  />
                </div>
                
                {/* Slider 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between font-metadata text-metadata uppercase">
                    <span className="text-on-surface-variant">STEALTH_QUOTIENT</span>
                    <span className="text-primary">{stealth}%</span>
                  </div>
                  <input 
                    className="w-full h-1 bg-surface-container-highest appearance-none cursor-pointer outline-none slider-tech" 
                    max="100" min="0" type="range" value={stealth} onChange={(e) => setStealth(parseInt(e.target.value))}
                    style={{ background: `linear-gradient(to right, #a5e7ff ${stealth}%, #2a2d33 ${stealth}%)` }}
                  />
                </div>
                
                {/* Slider 3 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between font-metadata text-metadata uppercase">
                    <span className="text-on-surface-variant">TECH_APTITUDE</span>
                    <span className="text-primary">{tech}%</span>
                  </div>
                  <input 
                    className="w-full h-1 bg-surface-container-highest appearance-none cursor-pointer outline-none slider-tech" 
                    max="100" min="0" type="range" value={tech} onChange={(e) => setTech(parseInt(e.target.value))}
                    style={{ background: `linear-gradient(to right, #a5e7ff ${tech}%, #2a2d33 ${tech}%)` }}
                  />
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Right Column: Bio Scan & Submission (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Section 3: BIO SCAN UPLOAD */}
            <div className="bg-surface-charcoal/80 border border-technical-gray p-6 flex flex-col flex-1 relative">
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>
              
              <div className="flex items-center gap-2 mb-4 border-b border-technical-gray pb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">scanner</span>
                <h2 className="font-data-mono text-data-mono text-primary uppercase tracking-widest">BIO_SCAN_IMAGE</h2>
              </div>
              
              {/* Drag and Drop Area */}
              <div 
                className={`flex-1 border-2 border-dashed border-technical-gray bg-[#0a0a0c] flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {/* Grid overlay pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(#a5e7ff 1px, transparent 1px), linear-gradient(90deg, #a5e7ff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                
                <span className="material-symbols-outlined text-display-lg text-on-surface-variant mb-4 group-hover:text-primary transition-colors relative z-10" style={{fontVariationSettings: "'FILL' 1"}}>upload_file</span>
                <p className="font-data-mono text-data-mono text-on-surface mb-2 relative z-10">INITIALIZE UPLOAD SEQUENCE</p>
                <p className="font-metadata text-metadata text-on-surface-variant relative z-10">DRAG & DROP OR CLICK TO BROWSE</p>
                <p className="font-metadata text-metadata text-primary mt-4 relative z-10 opacity-70">SUPPORTED_FORMATS: .JPG, .PNG, .DCM</p>
                
                <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" type="file"/>
              </div>
              
              {/* Status Display */}
              <div className="mt-4 flex items-center justify-between border border-technical-gray bg-[#0a0a0c] p-2">
                <div className="flex items-center gap-2 font-metadata text-metadata">
                  <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                  <span className="text-on-surface-variant">SCAN_STATUS:</span>
                  <span className="text-error uppercase">PENDING_INPUT</span>
                </div>
              </div>
            </div>
            
            {/* Submit Action */}
            <div className="mt-auto">
              <button 
                className="w-full bg-primary text-[#0a0a0c] font-label-caps text-label-caps py-4 uppercase tracking-widest hover:bg-primary-fixed-dim transition-all shadow-[0_0_12px_rgba(0,210,255,0.3)] hover:shadow-[0_0_20px_rgba(0,210,255,0.6)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]" 
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">data_check</span>
                COMMIT_TO_MAINFRAME
              </button>
              <p className="text-center font-metadata text-metadata text-on-surface-variant mt-3 opacity-50">BY COMMITTING, YOU AGREE TO A.I.D.A.S. DIRECTIVE 4A.</p>
            </div>
            
          </div>
        </form>
      </div>
    </>
  );
};
