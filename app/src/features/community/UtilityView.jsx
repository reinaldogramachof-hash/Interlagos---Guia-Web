import { useState, useEffect } from 'react';
import { Phone, Shield, Bus, Stethoscope, AlertTriangle, Search, Flame, Users, Trees, Heart, Loader2 } from 'lucide-react';
import { fetchPublicServices } from '../../services/communityService';

const ICON_MAP = {
  shield: Shield,
  alertTriangle: AlertTriangle,
  flame: Flame,
  stethoscope: Stethoscope,
  users: Users,
  bus: Bus,
  trees: Trees,
  heart: Heart,
};

export default function UtilityView({ onServiceClick }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPublicServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Todos', ...new Set(services.map(s => s.category))];

  const filtered = services.filter(s => {
    const matchesCat = selectedCategory === 'Todos' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (s.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-brand-600" size={32} /></div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-pill text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat ? 'bg-brand-600 text-white shadow-card' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar serviço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-card border-2 border-dashed border-slate-200">
          Nenhum serviço encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(s => {
            const Icon = ICON_MAP[s.icon_type] || Phone;
            return (
              <div
                key={s.id}
                onClick={() => onServiceClick?.(s)}
                className="bg-white p-5 rounded-card shadow-card border border-slate-100 flex items-start gap-4 hover:border-brand-500 transition-all cursor-pointer group"
              >
                <div className="p-3 bg-brand-50 rounded-xl text-brand-600 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 truncate">{s.name}</h3>
                    {s.is_emergency && (
                      <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase">Emergência</span>
                    )}
                  </div>
                  {s.phone && (
                    <a href={`tel:${s.phone.replace(/\D/g, '')}`} className="flex items-center gap-1.5 text-brand-600 font-black text-lg mb-1 hover:underline">
                      <Phone size={14} /> {s.phone}
                    </a>
                  )}
                  {s.hours && <p className="text-xs text-slate-400 font-medium mb-1">{s.hours}</p>}
                  <p className="text-sm text-slate-500 line-clamp-2">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
