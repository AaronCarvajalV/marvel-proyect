import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { heroService } from '../services/heroService';
import type { CreateHeroData } from '../services/heroService';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../context/AuthContext';

export const HeroForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id && id !== 'new';
  
  const [formData, setFormData] = useState<CreateHeroData>({
    nombre: '',
    nombre_real: '',
    poder_principal: '',
    nivel_poder: 1,
    imagen_url: '',
    estado: 'ACTIVO'
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/heroes');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchHero = async () => {
      if (!isEditing) return;
      try {
        const data = await heroService.getById(Number(id));
        setFormData({
          nombre: data.nombre,
          nombre_real: data.nombre_real || '',
          poder_principal: data.poder_principal,
          nivel_poder: data.nivel_poder,
          imagen_url: data.imagen_url || '',
          estado: data.estado
        });
      } catch (err) {
        setError('Error al cargar datos del operativo.');
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'nivel_poder' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    
    try {
      if (isEditing) {
        await heroService.update(Number(id), formData);
      } else {
        await heroService.create(formData);
      }
      navigate('/heroes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el operativo.');
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Recuperando protocolo de operativo..." />;

  return (
    <div className="max-w-[800px] mx-auto w-full space-y-gutter pb-8">
      {/* Top action */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/heroes')}
          className="flex items-center gap-2 text-outline hover:text-primary transition-colors bg-transparent border-none"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span className="font-label-caps text-label-caps">VOLVER</span>
        </button>
      </div>

      <div className="bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded-lg p-6 md:p-8">
        <div className="mb-8 border-b border-glass-border/50 pb-4">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface tracking-tight m-0 mb-1">
            {isEditing ? 'ACTUALIZAR PROTOCOLO' : 'NUEVO REGISTRO DE OPERATIVO'}
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
              label="NOMBRE CÓDIGO (ALIAS)" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              required 
              placeholder="Ej. Iron Man"
            />
            <Input 
              label="IDENTIDAD REAL" 
              name="nombre_real" 
              value={formData.nombre_real || ''} 
              onChange={handleChange} 
              placeholder="Ej. Tony Stark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="PODER PRINCIPAL" 
              name="poder_principal" 
              value={formData.poder_principal} 
              onChange={handleChange} 
              required 
              placeholder="Ej. Armadura Tecnológica"
            />
            
            <div className="space-y-1 group">
              <label className="font-label-caps text-label-caps tracking-widest block text-primary">NIVEL DE PODER (1-10)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="nivel_poder" 
                  min="1" max="10" 
                  value={formData.nivel_poder} 
                  onChange={handleChange}
                  className="w-full bg-surface-charcoal/50 border border-glass-border rounded-[4px] py-3 px-4 font-data-mono text-data-mono text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-charcoal/80 transition-all placeholder:text-on-surface-variant/30"
                />
                <div className="absolute inset-0 border border-primary/20 rounded-[4px] pointer-events-none opacity-0 group-focus-within:opacity-100 group-focus-within:animate-pulse-slow"></div>
              </div>
            </div>
          </div>

          <Input 
            label="URL DE IMAGEN DEL PERFIL" 
            name="imagen_url" 
            value={formData.imagen_url || ''} 
            onChange={handleChange} 
            placeholder="https://..."
          />

          <div className="space-y-1 group">
            <label className="font-label-caps text-label-caps tracking-widest block text-primary">ESTADO ACTUAL</label>
            <div className="relative">
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full bg-surface-charcoal/50 border border-glass-border rounded-[4px] py-3 px-4 font-data-mono text-data-mono text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-charcoal/80 transition-all appearance-none"
              >
                <option value="ACTIVO">ACTIVO (Desplegable)</option>
                <option value="INACTIVO">INACTIVO (En Reserva)</option>
                <option value="MIA">MIA (Desaparecido en Acción)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
              <div className="absolute inset-0 border border-primary/20 rounded-[4px] pointer-events-none opacity-0 group-focus-within:opacity-100 group-focus-within:animate-pulse-slow"></div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/heroes')}>CANCELAR</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'PROCESANDO...' : 'GUARDAR PROTOCOLO'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
