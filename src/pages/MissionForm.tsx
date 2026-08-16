import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { missionService } from '../services/missionService';
import type { CreateMissionData } from '../services/missionService';
import { heroService } from '../services/heroService';
import type { Hero } from '../services/heroService';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../context/AuthContext';

export const MissionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id && id !== 'new';
  
  const [formData, setFormData] = useState<CreateMissionData>({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    fecha: new Date().toISOString().split('T')[0],
    nivel_peligro: 'MEDIO',
    estado: 'PENDIENTE',
    superheroe_id: null
  });
  
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/missions');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const heroesData = await heroService.getAll();
        setHeroes(heroesData);

        if (isEditing) {
          const data = await missionService.getById(Number(id));
          setFormData({
            titulo: data.titulo,
            descripcion: data.descripcion || '',
            ubicacion: data.ubicacion,
            fecha: data.fecha.split(' ')[0], // Simple date parsing
            nivel_peligro: data.nivel_peligro,
            estado: data.estado,
            superheroe_id: data.superheroe_id
          });
        }
      } catch (err) {
        setError('Error al cargar datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'superheroe_id' ? (value ? Number(value) : null) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    
    try {
      if (isEditing) {
        await missionService.update(Number(id), formData);
      } else {
        await missionService.create(formData);
      }
      navigate('/missions');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la misión.');
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Recuperando protocolo de misión..." />;

  return (
    <div className="max-w-[800px] mx-auto w-full space-y-gutter pb-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/missions')}
          className="flex items-center gap-2 text-outline hover:text-primary transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span className="font-label-caps text-label-caps">VOLVER</span>
        </button>
      </div>

      <div className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg p-6 md:p-8">
        <div className="mb-8 border-b border-glass-border/50 pb-4">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface tracking-tight m-0 mb-1">
            {isEditing ? 'ACTUALIZAR MISIÓN' : 'NUEVO REGISTRO DE MISIÓN'}
          </h2>
          <span className="font-metadata text-metadata text-secondary-container">Acreditación Nivel 8 Requerida</span>
        </div>

        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 p-4 rounded-DEFAULT text-[#ef4444] mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span className="font-data-mono">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="TÍTULO DE LA MISIÓN" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              required 
              placeholder="Ej. Operación Sokovia"
            />
            <Input 
              label="UBICACIÓN" 
              name="ubicacion" 
              value={formData.ubicacion} 
              onChange={handleChange} 
              required
              placeholder="Ej. New York City"
            />
          </div>

          <div className="space-y-1 group">
            <label className="font-label-caps text-label-caps tracking-widest block text-primary">DESCRIPCIÓN DE LA MISIÓN</label>
            <div className="relative">
              <textarea
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                rows={4}
                className="w-full bg-surface-charcoal/50 border border-glass-border rounded-[4px] py-3 px-4 font-data-mono text-data-mono text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-charcoal/80 transition-all placeholder:text-on-surface-variant/30 resize-y"
                placeholder="Detalles operativos..."
              />
              <div className="absolute inset-0 border border-primary/20 rounded-[4px] pointer-events-none opacity-0 group-focus-within:opacity-100 group-focus-within:animate-pulse-slow"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="FECHA" 
              name="fecha" 
              type="date"
              value={formData.fecha} 
              onChange={handleChange} 
              required 
            />
            
            <div className="space-y-1 group">
              <label className="font-label-caps text-label-caps tracking-widest block text-primary">NIVEL DE PELIGRO</label>
              <div className="relative">
                <select
                  name="nivel_peligro"
                  value={formData.nivel_peligro}
                  onChange={handleChange}
                  className="w-full bg-surface-charcoal/50 border border-glass-border rounded-[4px] py-3 px-4 font-data-mono text-data-mono text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-charcoal/80 transition-all appearance-none"
                >
                  <option value="BAJO">BAJO</option>
                  <option value="MEDIO">MEDIO</option>
                  <option value="ALTO">ALTO</option>
                  <option value="EXTREMO">EXTREMO (Nivel Avengers)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
                <div className="absolute inset-0 border border-primary/20 rounded-[4px] pointer-events-none opacity-0 group-focus-within:opacity-100 group-focus-within:animate-pulse-slow"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 group">
              <label className="font-label-caps text-label-caps tracking-widest block text-primary">OPERATIVO ASIGNADO</label>
              <div className="relative">
                <select
                  name="superheroe_id"
                  value={formData.superheroe_id || ''}
                  onChange={handleChange}
                  className="w-full bg-surface-charcoal/50 border border-glass-border rounded-[4px] py-3 px-4 font-data-mono text-data-mono text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-charcoal/80 transition-all appearance-none"
                >
                  <option value="">SIN ASIGNAR</option>
                  {heroes.map(h => (
                    <option key={h.id} value={h.id}>{h.nombre}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
                <div className="absolute inset-0 border border-primary/20 rounded-[4px] pointer-events-none opacity-0 group-focus-within:opacity-100 group-focus-within:animate-pulse-slow"></div>
              </div>
            </div>

            <div className="space-y-1 group">
              <label className="font-label-caps text-label-caps tracking-widest block text-primary">ESTADO ACTUAL</label>
              <div className="relative">
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full bg-surface-charcoal/50 border border-glass-border rounded-[4px] py-3 px-4 font-data-mono text-data-mono text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-charcoal/80 transition-all appearance-none"
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="EN_PROGRESO">EN PROGRESO</option>
                  <option value="COMPLETADA">COMPLETADA</option>
                  <option value="CANCELADA">CANCELADA</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
                <div className="absolute inset-0 border border-primary/20 rounded-[4px] pointer-events-none opacity-0 group-focus-within:opacity-100 group-focus-within:animate-pulse-slow"></div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/missions')}>CANCELAR</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'PROCESANDO...' : 'GUARDAR PROTOCOLO'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
