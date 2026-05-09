import { useState, useEffect } from 'react';
import { Phone, Shield, Bus, Stethoscope, AlertTriangle, Flame, Users, Trees, Heart, Loader2, Clock } from 'lucide-react';
import { fetchPublicServices } from '../../services/communityService';
import BusScheduleModal from './BusScheduleModal';
import { PageHero, SearchBar, CategoryChips, MobileCard, SectionHeader } from '../../components/mobile';

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
  const [busLine, setBusLine] = useState(null);

  useEffect(() => {
    fetchPublicServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Todos', ...new Set(services.map(s => s.category))];

  const filtered = services.filter(s => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesCat = selectedCategory === 'Todos' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(normalizedSearch) ||
      (s.description?.toLowerCase().includes(normalizedSearch));
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="mobile-page flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  return (
    <div className="mobile-page animate-in fade-in slide-in-from-bottom-4">
      <div className="sticky top-14 z-20 mobile-sticky-panel pb-2 shadow-sm">
        <PageHero
          section="news"
          title="Serviços Úteis"
          subtitle="Telefones e contatos importantes"
          icon={Phone}
          compact
        />

        <div className="px-3 pt-3 space-y-2">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar serviço..."
          />
          <CategoryChips
            items={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            section="news"
            getId={(item) => item}
            getLabel={(item) => item}
          />
        </div>
      </div>

      <SectionHeader
        title="Contatos do bairro"
        subtitle={`${filtered.length} serviço${filtered.length !== 1 ? 's' : ''}`}
      />

      {filtered.length === 0 ? (
        <div className="mx-4 text-center py-10 text-slate-500 bg-slate-50 rounded-card border-2 border-dashed border-slate-200">
          Nenhum serviço encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 px-4">
          {filtered.map(s => {
            const Icon = ICON_MAP[s.icon_type] || Phone;
            const busLineKey = s.name.includes('315') ? '315' : s.name.includes('316') ? '316' : null;
            return (
              <MobileCard
                key={s.id}
                onClick={() => onServiceClick?.(s)}
                bodyClassName="flex items-start gap-4"
              >
                <div className="p-3 bg-brand-50 rounded-xl text-brand-600 shrink-0">
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
                  {busLineKey && (
                    <button
                      onClick={e => { e.stopPropagation(); setBusLine(busLineKey); }}
                      className="mt-2 text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <Clock size={12} /> Ver Horários Completos
                    </button>
                  )}
                </div>
              </MobileCard>
            );
          })}
        </div>
      )}

      <BusScheduleModal isOpen={!!busLine} onClose={() => setBusLine(null)} line={busLine} />
    </div>
  );
}
