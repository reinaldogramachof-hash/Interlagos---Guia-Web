import { useState, useEffect } from 'react';
import { adminGetMerchants, createMerchant, updateMerchant } from '../../../services/merchantService';
import { uploadImage } from '../../../services/storageService';
import { Trophy, Search, Plus, Save, X, ImagePlus, Loader2 } from 'lucide-react';
import { useToast } from '../../../components/Toast';

const INITIAL_FORM = { name: '', category: 'Alimentação', description: '', phone: '', whatsapp: '', address: '', plan: 'free', socialLinks: { instagram: '', facebook: '', site: '' }, gallery: [] };
const CATEGORIES = ['Alimentação', 'Saúde', 'Automotivo', 'Beleza', 'Serviços', 'Tecnologia', 'Educação', 'Outros'];
const PLANS = [
  { value: 'free',         label: 'Grátis',   color: 'gray',   desc: 'Card simples, prioridade baixa.' },
  { value: 'basic',        label: 'Básico',   color: 'blue',   desc: 'Card com foto, botão Zap.' },
  { value: 'professional', label: 'Pro',      color: 'indigo', desc: 'Destaque, redes sociais, galeria.' },
  { value: 'premium',      label: 'Premium',  color: 'amber',  desc: 'Super destaque, topo da lista.' },
];

export default function MerchantsTab() {
  const [merchants, setMerchants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToast();

  const fetchMerchants = async () => {
    const data = await adminGetMerchants();
    setMerchants(data);
  };

  useEffect(() => {
    fetchMerchants();
    const interval = setInterval(fetchMerchants, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Upload de imagem se houver arquivo selecionado
      let finalImageUrl = form.image_url;
      if (imageFile) {
        const safeName = imageFile.name.replace(/\s+/g, '-');
        const path = `merchants/${Date.now()}-${safeName}`;
        finalImageUrl = await uploadImage('merchant-images', imageFile, path);
      }

      const payload = {
        ...form,
        image_url: finalImageUrl,
        social_links: form.socialLinks,
        neighborhood: import.meta.env.VITE_NEIGHBORHOOD,
        is_active: true,
      };
      delete payload.socialLinks;

      if (isCreating) {
        payload.whatsapp = payload.whatsapp.replace(/\D/g, '');
        await createMerchant(payload);
      } else {
        await updateMerchant(editingId, payload);
      }

      setIsCreating(false);
      setEditingId(null);
      setForm(INITIAL_FORM);
      setImageFile(null);
      showToast('Comércio salvo!', 'success');
      fetchMerchants();
    } catch (err) {
      showToast(`Erro ao salvar. ${err.message || 'Tente novamente.'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const setField = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const setSocial = (k, v) => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [k]: v } }));
  const showSocials = ['professional', 'premium'].includes(form.plan);
  const filtered = merchants.filter(m => m.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex gap-6 h-full">
      {/* Lista */}
      <div className="w-1/3 border-r border-gray-100 pr-4 flex flex-col">
        <div className="mb-4 space-y-2">
          <button onClick={() => { setIsCreating(true); setEditingId(null); setForm(INITIAL_FORM); }} className="w-full bg-brand-600 text-white py-2 rounded-pill font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors"><Plus size={16} /> Novo</button>
          <div className="relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={16} /><input className="w-full pl-9 p-2 border rounded-lg text-slate-900" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.map(m => (
            <div key={m.id} onClick={() => { setEditingId(m.id); setIsCreating(false); setForm({ ...INITIAL_FORM, ...m, socialLinks: m.social_links || INITIAL_FORM.socialLinks }); }} className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 flex justify-between items-center ${editingId === m.id ? 'border-indigo-500 ring-1 ring-indigo-500' : ''}`}>
              <div><div className="font-bold text-sm text-slate-800">{m.name}</div><div className="text-xs text-gray-500">{m.category}</div></div>
              {m.plan === 'premium' && <Trophy size={14} className="text-amber-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 pl-2 overflow-y-auto">
        {(isCreating || editingId) ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">{isCreating ? 'Novo Comércio' : 'Editando Comércio'}</h3>
              <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PLANS.map(({ value, label, desc }) => (
                <label key={value} className={`cursor-pointer border p-3 rounded-lg text-center ${form.plan === value ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200' : 'border-gray-200'}`}>
                  <input type="radio" name="plan" value={value} checked={form.plan === value} onChange={e => setField('plan', e.target.value)} className="hidden" />
                  <div className="font-bold text-sm mb-1">{label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{desc}</div>
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Nome</label><input className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" value={form.name} onChange={e => setField('name', e.target.value)} required /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Categoria</label><select className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" value={form.category} onChange={e => setField('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
            </div>
            <div><label className="block text-xs font-bold text-slate-500 mb-1">Descrição</label><textarea className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" rows="2" value={form.description} onChange={e => setField('description', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">WhatsApp</label><input className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="11999999999" value={form.whatsapp} onChange={e => setField('whatsapp', e.target.value)} /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Endereço</label><input className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" value={form.address} onChange={e => setField('address', e.target.value)} /></div>
            </div>
            {showSocials && (
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-500 mb-2">Redes Sociais</label>
                <div className="grid grid-cols-3 gap-2">
                  <input className="border p-2 rounded text-slate-900 text-xs" placeholder="@instagram" value={form.socialLinks?.instagram || ''} onChange={e => setSocial('instagram', e.target.value)} />
                  <input className="border p-2 rounded text-slate-900 text-xs" placeholder="Facebook" value={form.socialLinks?.facebook || ''} onChange={e => setSocial('facebook', e.target.value)} />
                  <input className="border p-2 rounded text-slate-900 text-xs" placeholder="Site" value={form.socialLinks?.site || ''} onChange={e => setSocial('site', e.target.value)} />
                </div>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 mb-2">Imagem do Comércio</label>
              {form.image_url && (
                <div className="mb-2">
                  <img src={form.image_url} alt="Imagem atual" className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 text-sm font-medium transition-colors">
                  <ImagePlus size={16} />
                  {imageFile ? imageFile.name : 'Selecionar imagem'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <button type="submit" disabled={isSaving} className="w-full bg-brand-600 text-white py-3 rounded-pill font-bold hover:bg-brand-700 flex items-center justify-center gap-2 shadow-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? <><Loader2 size={18} className="animate-spin" /> Salvando...</> : <><Save size={18} /> {isCreating ? 'Criar Comércio' : 'Salvar Alterações'}</>}
            </button>
          </form>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <Trophy size={48} className="mb-4 text-gray-200" />
            <p>Selecione um comércio ou <button onClick={() => { setIsCreating(true); setForm(INITIAL_FORM); }} className="text-indigo-600 font-bold hover:underline">crie um novo</button>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
