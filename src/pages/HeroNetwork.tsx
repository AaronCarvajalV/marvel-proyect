import React, { useEffect, useState } from 'react';
import { heroService } from '../services/heroService';
import type { Hero } from '../services/heroService';
import { HeroCard } from '../components/ui/HeroCard';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HeroNetwork: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const data = await heroService.getAll();
        setHeroes(data);
      } catch (error) {
        console.error("Error fetching heroes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, []);

  const filteredHeroes = heroes.filter(hero => 
    hero.nombre.toLowerCase().includes(search.toLowerCase()) || 
    (hero.nombre_real && hero.nombre_real.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-container-max mx-auto space-y-gutter">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-sm">badge</span>
            <h3 className="font-label-caps text-label-caps text-primary tracking-widest">ASSET_DATABASE</h3>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface tracking-tight">
            Hero Network
          </h1>
          <p className="font-data-mono text-data-mono text-on-surface-variant mt-2">
            Directorio global de operativos y activos registrados.
          </p>
        </div>
        
        {useAuth().user?.role === 'ADMIN' && (
          <Link 
            to="/heroes/new" 
            className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary text-primary px-4 py-2 rounded-DEFAULT font-label-caps text-label-caps transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            REGISTRAR OPERATIVO
          </Link>
        )}
      </section>

      {/* Search Section */}
      <section className="bg-surface-charcoal/60 backdrop-blur-md border border-glass-border rounded-lg p-2 flex items-center gap-2 focus-within:border-primary/50 transition-colors">
        <span className="material-symbols-outlined text-outline ml-2">search</span>
        <input 
          type="text" 
          placeholder="Buscar por nombre código o identidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-on-surface font-data-mono text-data-mono flex-1 px-2 py-2 placeholder:text-outline"
        />
      </section>

      {/* Grid Section */}
      <section className="pb-8">
        {loading ? (
          <LoadingState message="Decodificando red de operativos..." />
        ) : filteredHeroes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {filteredHeroes.map(hero => (
              <HeroCard key={hero.id} hero={hero} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<span className="material-symbols-outlined text-4xl opacity-50">groups</span>}
            title="SIN RESULTADOS"
            description={search ? "No se encontraron operativos que coincidan con los parámetros de búsqueda." : "No hay operativos registrados en la base de datos de SHIELD."}
          />
        )}
      </section>
    </div>
  );
};
