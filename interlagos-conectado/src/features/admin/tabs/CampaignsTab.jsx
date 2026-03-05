import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Heart, Trash2 } from 'lucide-react';

export default function CampaignsTab() {
  const [campaigns, setCampaigns] = useState([]);

  const fetchCampaigns = async () => {
    const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
    setCampaigns(data || []);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta campanha permanentemente?')) return;
    await supabase.from('campaigns').delete().eq('id', id);
    fetchCampaigns();
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800"><Heart className="text-pink-600" /> Campanhas Ativas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold uppercase text-pink-600 bg-pink-50 px-2 py-1 rounded-full">Campanha</span>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Heart className="mx-auto mb-2 text-slate-300" size={32} />
            <p>Nenhuma campanha ativa no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
