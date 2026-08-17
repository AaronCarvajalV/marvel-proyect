import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { missionService, type CreateMissionData } from '../services/missionService';
import { heroService, type Hero } from '../services/heroService';
import { targetLocationService, type TargetLocation } from '../services/targetLocationService';

export const MissionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<CreateMissionData>({
    titulo: '',
    descripcion: '',
    target_location_id: 1, // Defaulting to first location or null if you prefer, wait I need to make it a number. It can be 1 by default, or empty if we make it nullable. Let's make it 1 initially, but updated once locations load. Or 0 and force user to select.
    fecha: new Date().toISOString().split('T')[0],
    nivel_peligro: 'MEDIO',
    estado: 'PENDIENTE',
    superheroe_id: null,
  });

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [locations, setLocations] = useState<TargetLocation[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initForm = async () => {
      try {
        const [heroesData, locationsData] = await Promise.all([
          heroService.getAll(),
          targetLocationService.getAll()
        ]);
        setHeroes(heroesData);
        setLocations(locationsData);
        
        if (!isEditing && locationsData.length > 0) {
            setFormData(prev => ({ ...prev, target_location_id: locationsData[0].id }));
        }

        if (isEditing) {
          const missionData = await missionService.getById(parseInt(id, 10));
          setFormData({
            titulo: missionData.titulo,
            descripcion: missionData.descripcion || '',
            target_location_id: missionData.target_location_id,
            fecha: missionData.fecha,
            nivel_peligro: missionData.nivel_peligro,
            estado: missionData.estado,
            superheroe_id: missionData.superheroe_id,
          });
        }
      } catch (error) {
        console.error("Failed to initialize form", error);
        navigate('/missions');
      } finally {
        setIsLoading(false);
      }
    };
    initForm();
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'superheroe_id' || name === 'target_location_id') ? (value ? parseInt(value, 10) : null) : value
    }));
  };

  const handleThreatLevelChange = (level: string) => {
    setFormData(prev => ({ ...prev, nivel_peligro: level }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing) {
        await missionService.update(parseInt(id, 10), formData);
      } else {
        await missionService.create(formData);
      }
      navigate('/missions');
    } catch (error) {
      console.error("Failed to save mission", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-container-max mx-auto text-primary font-data-mono animate-pulse pt-10">ACCESSING_SECURE_RECORDS...</div>;
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-container-max mx-auto relative z-10 pb-12">
      <style>
        {`
          @keyframes scan {
              0% { top: 0; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
          }
          
          /* Form Inputs Focus Ring Reset */
          input:focus, textarea:focus, select:focus {
              outline: none;
              box-shadow: none;
          }
        `}
      </style>

      {/* Page Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-grid-line pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-metadata text-metadata text-primary uppercase tracking-widest">ARCHIVE / OPERATION PARAMETERS</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {isEditing ? 'EDIT MISSION' : 'REGISTER MISSION'}
          </h1>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <button 
            type="button"
            onClick={() => navigate('/missions')}
            className="px-4 py-2 border border-outline-variant text-on-surface-variant font-label-caps text-label-caps rounded-sm hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            DISCARD_CHANGES
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`px-4 py-2 bg-primary text-on-primary font-label-caps text-label-caps rounded-sm transition-all duration-300 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_12px_rgba(0,210,255,0.4)] cursor-pointer'}`}
          >
            {isSaving ? 'PROCESSING...' : (isEditing ? 'UPDATE_PROTOCOL' : 'INITIATE_PROTOCOL')}
          </button>
        </div>
      </header>

      {/* Edit Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Column: Primary Data */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Identification Card */}
          <section className="bg-surface-charcoal border border-outline-variant rounded-sm overflow-hidden">
            <div className="bg-surface-container border-b border-outline-variant px-4 py-2 flex items-center justify-between">
              <h2 className="font-data-mono text-data-mono text-on-surface">MISSION_IDENTIFICATION</h2>
              <span className="material-symbols-outlined text-outline-variant text-[16px]">fingerprint</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2 group">
                <label className="font-metadata text-metadata text-outline uppercase group-focus-within:text-primary transition-colors block">OPERATION TITLE</label>
                <input 
                  className="w-full bg-surface border border-outline-variant text-on-surface font-body-lg px-4 py-3 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-data-mono" 
                  type="text" 
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2 group">
                <label className="font-metadata text-metadata text-outline uppercase group-focus-within:text-primary transition-colors block">TACTICAL OVERVIEW</label>
                <textarea 
                  className="w-full bg-surface border border-outline-variant text-on-surface-variant font-body-sm px-4 py-3 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none" 
                  rows={4}
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="font-metadata text-metadata text-outline uppercase group-focus-within:text-primary transition-colors block">PRIMARY OPERATIVE</label>
                  <select 
                    className="w-full bg-surface border border-outline-variant text-on-surface font-data-mono px-4 py-3 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    name="superheroe_id"
                    value={formData.superheroe_id || ''}
                    onChange={handleChange}
                  >
                    <option value="">-- UNASSIGNED --</option>
                    {heroes.map(hero => (
                      <option key={hero.id} value={hero.id}>{hero.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2 group">
                  <label className="font-metadata text-metadata text-outline uppercase group-focus-within:text-primary transition-colors block">STATUS</label>
                  <select 
                    className="w-full bg-surface border border-outline-variant text-on-surface font-data-mono px-4 py-3 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="EN_PROGRESO">EN_PROGRESO</option>
                    <option value="COMPLETADA">COMPLETADA</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Threat Level Card */}
          <section className="bg-surface-charcoal border border-outline-variant rounded-sm overflow-hidden">
            <div className="bg-surface-container border-b border-outline-variant px-4 py-2 flex items-center justify-between">
              <h2 className="font-data-mono text-data-mono text-on-surface">THREAT_ASSESSMENT</h2>
              <span className="material-symbols-outlined text-outline-variant text-[16px]">warning</span>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <label className="font-metadata text-metadata text-outline uppercase block">CURRENT THREAT LEVEL</label>
                
                {/* Custom Radio Group for Threat Level */}
                <div className="grid grid-cols-4 gap-3">
                  
                  {/* BAJO (Low) */}
                  <label className="relative cursor-pointer">
                    <input 
                      className="peer sr-only" 
                      name="threat_level" 
                      type="radio" 
                      value="BAJO"
                      checked={formData.nivel_peligro === 'BAJO'}
                      onChange={() => handleThreatLevelChange('BAJO')}
                    />
                    <div className="w-full py-3 border border-outline-variant text-center rounded-sm peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-on-surface-variant font-data-mono text-[10px] transition-all">
                      LOW
                    </div>
                  </label>
                  
                  {/* MEDIO (Medium) */}
                  <label className="relative cursor-pointer">
                    <input 
                      className="peer sr-only" 
                      name="threat_level" 
                      type="radio" 
                      value="MEDIO"
                      checked={formData.nivel_peligro === 'MEDIO'}
                      onChange={() => handleThreatLevelChange('MEDIO')}
                    />
                    <div className="w-full py-3 border border-outline-variant text-center rounded-sm peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-on-surface-variant font-data-mono text-[10px] transition-all">
                      MEDIUM
                    </div>
                  </label>

                  {/* ALTO (High) */}
                  <label className="relative cursor-pointer">
                    <input 
                      className="peer sr-only" 
                      name="threat_level" 
                      type="radio" 
                      value="ALTO"
                      checked={formData.nivel_peligro === 'ALTO'}
                      onChange={() => handleThreatLevelChange('ALTO')}
                    />
                    <div className="w-full py-3 border border-outline-variant text-center rounded-sm peer-checked:bg-secondary-container/10 peer-checked:border-secondary-container peer-checked:text-secondary-container text-on-surface-variant font-data-mono text-[10px] transition-all">
                      HIGH
                    </div>
                  </label>
                  
                </div>
              </div>
            </div>
          </section>
          
        </div>

        {/* Right Column: Coordinates & Map */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="bg-surface-charcoal border border-outline-variant rounded-sm overflow-hidden flex-1 flex flex-col">
            <div className="bg-surface-container border-b border-outline-variant px-4 py-2 flex items-center justify-between">
              <h2 className="font-data-mono text-data-mono text-on-surface">LOCATIONAL_DATA</h2>
              <span className="material-symbols-outlined text-outline-variant text-[16px]">radar</span>
            </div>
            
            <div className="p-6 flex-1 flex flex-col space-y-6">
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2 group">
                  <label className="font-metadata text-metadata text-outline uppercase group-focus-within:text-primary transition-colors block">TARGET LOCATION</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-surface border border-outline-variant text-on-surface font-data-mono px-4 py-2 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all pl-8 appearance-none cursor-pointer" 
                      name="target_location_id"
                      value={formData.target_location_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>-- SELECT LOCATION --</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.city}, {loc.country} ({loc.country_code})
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant text-[16px]">location_on</span>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="font-metadata text-metadata text-outline uppercase group-focus-within:text-primary transition-colors block">DATE</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface border border-outline-variant text-on-surface font-data-mono px-4 py-2 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all pl-8" 
                      type="date" 
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                    />
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant text-[16px]">calendar_today</span>
                  </div>
                </div>
              </div>
              
              {/* Technical Map Visual */}
              <div className="relative flex-1 min-h-[300px] border border-glass-border rounded-sm overflow-hidden bg-surface-dim mt-4 group">
                {/* Overlay UI on Map */}
                <div className="absolute top-2 left-2 z-10 flex gap-2">
                  <span className="bg-surface/80 backdrop-blur-sm border border-outline-variant px-2 py-1 font-metadata text-metadata text-primary">SAT_LINK_ACTIVE</span>
                </div>
                
                {/* Map Image Placeholder */}
                <div 
                  className="w-full h-full bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-500" 
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA10mvGkO2th3U78RYp61hzGyP3omwjJnBNiI2i466tCV0lCXahYV4YtfrYuv9UKJ6o3PcvYZe59YvIKnStosQnBHgxF04w_xh573MTiXyX7bxKeHQuh8xI-cKc2v0vboA8Smn5Asz37mChP822FppU26yAJMormABj3DZ9VEr9ZzLe7AQofkA-OgMXbQiE-0og3wogNwADknh-vcdnHzFFjlPrasHSosZ3eQ2g5bmrS-35bxSmsnBi')"}}
                >
                </div>
                
                {/* Map Reticle/Target */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-16 h-16 border border-error/50 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                    <div className="w-full h-[1px] bg-error/30 absolute"></div>
                    <div className="w-[1px] h-full bg-error/30 absolute"></div>
                  </div>
                  <div className="w-2 h-2 bg-error rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                  <div className="w-2 h-2 bg-error rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                {/* Scanner Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 shadow-[0_0_8px_rgba(0,210,255,0.8)] animate-[scan_3s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};
