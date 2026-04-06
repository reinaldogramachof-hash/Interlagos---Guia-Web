import { useState, useEffect } from 'react';
import { adminFetchCampaigns, deleteCampaign } from '../../../services/communityService';
import { Heart, Trash2, Store, Users } from 'lucide-react';
import { useToast } from '../../../components/Toast';

export default function CampaignsTab() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await adminFetchCampaigns();
      setCampaigns(data);
    } catch (error) {
      showToast('Erro ao carregar campanhas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCampaign(id);
      showToast('Campanha excluída.', 'success');
      fetchCampaigns();
    } catch (error) {
      showToast('Erro ao excluir campanha.', 'error');
    }
  };

  // Separar ações sociais de campanhas de comerciantes
  const socialCampaigns   = campaigns.filter(c => !c.merchant_id);
  const merchantCampaigns = campaigns.filter(c =>  c.merchant_id);

  const CampaignCard = ({ item, type }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        {type === 'social' ? (
          <span className="text-[10px] font-bold uppercase text-pink-600 bg-pink-50 px-2 py-1 rounded-full flex items-center gap-1">
            <Users size={10} /> Ação Social
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
            <Store size={10} /> Cupom / Parceiro
          </span>
        )}
        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
          <Trash2 size={16} />
        </button>
      </div>
      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
      <p className="text-sm text-slate-500 line-clamp-2 mb-2">{item.description}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Válido: {item.start_date} → {item.end_date}</span>
        {item.discount && item.discount !== '0' && (
          <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
            -{item.discount}%
          </span>
        )}
      </div>
    </div>
  );

  if (loading) return <p className="text-center text-slate-400 py-10">Carregando campanhas...</p>;

  return (
    <div className="space-y-8">
      {/* Ações Sociais (sem merchant_id) */}
      <div>
        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 mb-4">
          <Heart className="text-pink-600" /> Ações Solidárias ({socialCampaigns.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialCampaigns.map(item => (
            <CampaignCard key={item.id} item={item} type="social" />
          ))}
          {socialCampaigns.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Heart className="mx-auto mb-2 text-slate-300" size={28} />
              <p className="text-sm">Nenhuma ação solidária ativa.</p>
            </div>
          )}
        </div>
      </div>

      {/* Campanhas de Comerciantes (com merchant_id) */}
      <div>
        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 mb-4">
          <Store className="text-amber-600" /> Cupons de Parceiros ({merchantCampaigns.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {merchantCampaigns.map(item => (
            <CampaignCard key={item.id} item={item} type="merchant" />
          ))}
          {merchantCampaigns.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Store className="mx-auto mb-2 text-slate-300" size={28} />
              <p className="text-sm">Nenhum cupom de parceiro ativo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
