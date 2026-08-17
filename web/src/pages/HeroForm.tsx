import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { heroService, type CreateHeroData } from '../services/heroService';

export const HeroForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<CreateHeroData>({
    nombre: '',
    nombre_real: '',
    poder_principal: '',
    nivel_poder: 50,
    imagen_url: '',
    estado: 'ACTIVO',
  });

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initForm = async () => {
      if (isEditing) {
        try {
          const heroData = await heroService.getById(parseInt(id, 10));
          setFormData({
            nombre: heroData.nombre,
            nombre_real: heroData.nombre_real || '',
            poder_principal: heroData.poder_principal,
            nivel_poder: heroData.nivel_poder,
            imagen_url: heroData.imagen_url || '',
            estado: heroData.estado,
          });
        } catch (error) {
          console.error("Failed to initialize hero form", error);
          navigate('/heroes');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    initForm();
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing) {
        await heroService.update(parseInt(id, 10), formData);
      } else {
        await heroService.create(formData);
      }
      navigate('/heroes');
    } catch (error) {
      console.error("Failed to save operative", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-container-max mx-auto text-primary font-data-mono animate-pulse pt-10">ACCESSING_SECURE_RECORDS...</div>;
  }

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
        <div className="mb-8 border-b border-glass-border pb-4 flex justify-between items-end relative">
          <div>
            <div className="absolute bottom-0 left-0 h-[1px] w-1/3 bg-primary/50" style={{boxShadow: "0 0 8px rgba(0, 210, 255, 0.8)"}}></div>
            <h1 className="font-display-lg text-display-lg md:text-display-lg text-on-surface mb-2 tracking-tight uppercase">
              {isEditing ? 'UPDATE_OPERATIVE' : 'REGISTER_OPERATIVE'}
            </h1>
            <div className="flex items-center gap-4 text-on-surface-variant font-data-mono text-data-mono">
              <span className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[16px]">fingerprint</span> SECURE_UPLINK
              </span>
              <span>//</span>
              <span>PERSONNEL DOSSIER INITIALIZATION</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => navigate('/heroes')}
              className="px-4 py-2 border border-outline-variant text-on-surface-variant font-label-caps text-label-caps rounded-sm hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            >
              DISCARD
            </button>
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
                  <input 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="tech-input bg-[#0a0a0c] border border-technical-gray text-on-surface font-data-mono text-data-mono px-4 py-2 w-full transition-all" 
                    placeholder="E.G. SPECTER_09" 
                    required 
                    type="text"
                  />
                </div>
                
                <div className="relative flex flex-col group">
                  <label className="font-metadata text-metadata text-on-surface-variant uppercase mb-1 group-focus-within:text-primary transition-colors">LEGAL IDENTIFIER (REAL NAME)</label>
                  <input 
                    name="nombre_real"
                    value={formData.nombre_real || ''}
                    onChange={handleChange}
                    className="tech-input bg-[#0a0a0c] border border-technical-gray text-on-surface font-data-mono text-data-mono px-4 py-2 w-full transition-all" 
                    placeholder="REDACTED_BY_DEFAULT" 
                    type="text"
                  />
                </div>

                <div className="relative flex flex-col group md:col-span-2">
                  <label className="font-metadata text-metadata text-on-surface-variant uppercase mb-1 group-focus-within:text-primary transition-colors">PRIMARY POWER / ABILITY</label>
                  <input 
                    name="poder_principal"
                    value={formData.poder_principal}
                    onChange={handleChange}
                    className="tech-input bg-[#0a0a0c] border border-technical-gray text-on-surface font-data-mono text-data-mono px-4 py-2 w-full transition-all" 
                    placeholder="E.G. ELECTROMAGNETIC PULSE GENERATION" 
                    required 
                    type="text"
                  />
                </div>
                
                <div className="relative flex flex-col group md:col-span-2">
                  <label className="font-metadata text-metadata text-on-surface-variant uppercase mb-1 group-focus-within:text-primary transition-colors">OPERATIVE STATUS</label>
                  <select 
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="tech-input bg-[#0a0a0c] border border-technical-gray text-on-surface font-data-mono text-data-mono px-4 py-2 w-full appearance-none transition-all cursor-pointer"
                  >
                    <option value="ACTIVO">ACTIVO - READY FOR DEPLOYMENT</option>
                    <option value="INACTIVO">INACTIVO - STANDBY / RECOVERY</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-7 text-on-surface-variant pointer-events-none">arrow_drop_down</span>
                </div>
              </div>
            </div>
            
            {/* Section 2: Power Metrics & Sliders */}
            <div className="bg-surface-charcoal/80 border border-technical-gray p-6 relative">
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-technical-gray pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  <h2 className="font-data-mono text-data-mono text-primary uppercase tracking-widest">METRIC_CALIBRATION</h2>
                </div>
                <div className="font-data-mono text-data-mono text-on-surface">
                  PWR_LEVEL: <span className="text-primary">{formData.nivel_poder}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between font-metadata text-metadata uppercase">
                    <span className="text-on-surface-variant">POWER_LEVEL</span>
                    <span className="text-primary">{formData.nivel_poder}%</span>
                  </div>
                  <input 
                    className="w-full h-1 bg-surface-container-highest appearance-none cursor-pointer outline-none slider-tech" 
                    max="100" min="0" type="range" name="nivel_poder" value={formData.nivel_poder} onChange={handleChange}
                    style={{ background: `linear-gradient(to right, #a5e7ff ${formData.nivel_poder}%, #2a2d33 ${formData.nivel_poder}%)` }}
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
                <span className="material-symbols-outlined text-primary text-[20px]">link</span>
                <h2 className="font-data-mono text-data-mono text-primary uppercase tracking-widest">ASSET_URL</h2>
              </div>
              
              <div className="relative flex flex-col group mb-4">
                <label className="font-metadata text-metadata text-on-surface-variant uppercase mb-1 group-focus-within:text-primary transition-colors">IMAGE URL</label>
                <input 
                  name="imagen_url"
                  value={formData.imagen_url || ''}
                  onChange={handleChange}
                  className="tech-input bg-[#0a0a0c] border border-technical-gray text-on-surface font-data-mono text-data-mono px-4 py-2 w-full transition-all text-xs" 
                  placeholder="https://..." 
                  type="url"
                />
              </div>

              {formData.imagen_url ? (
                 <div className="flex-1 border border-technical-gray bg-surface-dim overflow-hidden flex items-center justify-center">
                    <img src={formData.imagen_url} alt="Operative Preview" className="w-full h-full object-cover opacity-80 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-500" />
                 </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-technical-gray bg-[#0a0a0c] flex flex-col items-center justify-center p-6 text-center group relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(#a5e7ff 1px, transparent 1px), linear-gradient(90deg, #a5e7ff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                  <span className="material-symbols-outlined text-display-lg text-on-surface-variant mb-4 relative z-10" style={{fontVariationSettings: "'FILL' 1"}}>image</span>
                  <p className="font-data-mono text-data-mono text-on-surface mb-2 relative z-10">NO IMAGE LINKED</p>
                  <p className="font-metadata text-metadata text-on-surface-variant relative z-10">PROVIDE URL ABOVE</p>
                </div>
              )}
              
              {/* Status Display */}
              <div className="mt-4 flex items-center justify-between border border-technical-gray bg-[#0a0a0c] p-2">
                <div className="flex items-center gap-2 font-metadata text-metadata">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${formData.imagen_url ? 'bg-primary' : 'bg-error'}`}></div>
                  <span className="text-on-surface-variant">ASSET_STATUS:</span>
                  <span className={`uppercase ${formData.imagen_url ? 'text-primary' : 'text-error'}`}>{formData.imagen_url ? 'LINK_ESTABLISHED' : 'MISSING_DATA'}</span>
                </div>
              </div>
            </div>
            
            {/* Submit Action */}
            <div className="mt-auto">
              <button 
                className={`w-full bg-primary text-[#0a0a0c] font-label-caps text-label-caps py-4 uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-fixed-dim shadow-[0_0_12px_rgba(0,210,255,0.3)] hover:shadow-[0_0_20px_rgba(0,210,255,0.6)] cursor-pointer active:scale-[0.98]'}`}
                type="submit"
                disabled={isSaving}
              >
                <span className="material-symbols-outlined text-[18px]">data_check</span>
                {isSaving ? 'COMMITTING...' : 'COMMIT_TO_MAINFRAME'}
              </button>
              <p className="text-center font-metadata text-metadata text-on-surface-variant mt-3 opacity-50">BY COMMITTING, YOU AGREE TO A.I.D.A.S. DIRECTIVE 4A.</p>
            </div>
            
          </div>
        </form>
      </div>
    </>
  );
};
