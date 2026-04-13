import { useState, useEffect, useRef } from 'react';
import { PlusCircle, Trash2, Lock, Megaphone, Camera, Loader2 } from 'lucide-react';
import { fetchCampaignsByMerchant, createMerchantCampaign, deleteCampaign } from '../../../../services/communityService';
import { uploadImage } from '../../../../services/storageService';
import { useToast } from '../../../../components/Toast';
import { PLANS_CONFIG } from '../../../../constants/plans';

const EMPTY_FORM = { title: '', description: '', discount: '', start_date: '', end_date: '' };

export default function CampaignTab({ merchant, onUpgrade }) {
  const showToast = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const planConfig = PLANS_CONFIG[merchant?.plan] ?? PLANS_CONFIG['free'];
  const isPremium = planConfig.hasCampaigns;

  useEffect(() => {
    if (!merchant?.id || merchant.id === 'temp_dev' || !isPremium) { setLoading(false); return; }
    fetchCampaignsByMerchant(merchant.id)
      .then(setCampaigns)
      .catch(() => showToast('Erro ao carregar campanhas.', 'error'))
      .finally(() => setLoading(false));
  }, [merchant?.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_date || !form.end_date) return showToast('Preencha todos os campos obrigatórios.', 'error');
    setSaving(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `campaigns/merchant_${merchant.id}/${Date.now()}.${ext}`;
        imageUrl = await uploadImage('campaign-images', imageFile, path);
      }

      const newCampaign = await createMerchantCampaign({ ...form, merchant_id: merchant.id, image_url: imageUrl });
      setCampaigns(prev => [newCampaign, ...prev]);
      setForm(EMPTY_FORM);
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      showToast('Campanha criada! Aguarde aprovação.', 'success');
    } catch {
      showToast('Erro ao criar campanha.', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      showToast('Campanha removida.', 'info');
    } catch {
      showToast('Erro ao remover campanha.', 'error');
    }
  };

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Lock className="text-slate-300 mb-4" size={48} />
        <h3 className="font-bold text-xl text-slate-800 mb-2">Recurso Premium</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">
          Crie campanhas de desconto e promoções para atrair clientes. Disponível no plano Premium.
        </p>
        <button onClick={onUpgrade} className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors">
          Fazer Upgrade para Premium
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">Campanhas & Promoções</h3>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <PlusCircle size={18} /> Nova Campanha
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 space-y-4">
          <h4 className="font-bold text-slate-800">Nova Campanha</h4>
          <input type="text" placeholder="Título da campanha *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-sm" required />
          <textarea placeholder="Descrição" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-sm h-20 resize-none" />
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Foto (opcional)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 bg-white border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <Camera size={16} className="text-slate-400" />
                  <span className="text-xs text-slate-400">Adicionar foto</span>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                showToast('Imagem muito grande. Máximo 2MB.', 'error');
                return;
              }
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }} className="hidden" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <input type="text" placeholder="Desconto (ex: 20%)" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-sm" />
            <input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-sm" required />
            <input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} className="w-full p-3 rounded-xl border border-slate-200 outline-none text-sm" required />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">{saving ? 'Salvando...' : 'Criar Campanha'}</button>
            <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Megaphone className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-slate-500">Nenhuma campanha ativa. Crie sua primeira promoção!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-start shadow-sm">
              <div>
                <h4 className="font-bold text-slate-900">{c.title}</h4>
                {c.discount && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{c.discount} OFF</span>}
                <p className="text-xs text-slate-400 mt-1">{c.start_date} → {c.end_date}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                  {c.status === 'active' ? 'Ativa' : c.status === 'pending' ? 'Em Análise' : 'Inativa'}
                </span>
              </div>
              <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
