import { useState, useEffect } from 'react';
import { Phone, Plus, Save, X, Trash2, Search, Shield, Loader2 } from 'lucide-react';
import { adminFetchPublicServices, createPublicService, updatePublicService, deletePublicService } from '../../../services/communityService';
import { useToast } from '../../../components/Toast';

const CATEGORIES = ['Emergências', 'Saúde', 'Transporte', 'Educação', 'Assistência Social', 'Lazer', 'Meio Ambiente'];
const ICON_OPTIONS = ['alertTriangle', 'stethoscope', 'bus', 'users', 'heart', 'trees', 'shield', 'flame'];
const INITIAL_FORM = {
  name: '', category: 'Emergências', description: '', phone: '',
  hours: '', address: '', icon_type: 'shield', is_emergency: false
};

export default function UtilitiesTab() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToast();

  const fetchItems = async () => {
    try {
      const data = await adminFetchPublicServices();
      setServices(data);
    } catch (err) { console.error('Error fetching services:', err); }
  };

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isCreating) {
        await createPublicService(form);
        showToast('Serviço criado com sucesso!', 'success');
      } else {
        await updatePublicService(editingId, form);
        showToast('Serviço atualizado!', 'success');
      }
      setIsCreating(false);
      setEditingId(null);
      setForm(INITIAL_FORM);
      fetchItems();
    } catch (err) {
      showToast('Erro ao salvar: ' + err.message, 'error');
    } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Excluir este serviço permanentemente?')) return;
    try {
      await deletePublicService(editingId);
      showToast('Serviço excluído.', 'success');
      setEditingId(null);
      fetchItems();
    } catch (err) { showToast('Erro ao excluir: ' + err.message, 'error'); }
  };

  const filtered = services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex gap-6 h-full">
      <div className="w-1/3 border-r border-slate-100 pr-4 flex flex-col">
        <div className="mb-4 space-y-2">
          <button onClick={() => { setIsCreating(true); setEditingId(null); setForm(INITIAL_FORM); }} className="w-full bg-brand-600 text-white py-2.5 rounded-pill font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors shadow-sm text-sm"><Plus size={16} /> Novo Serviço</button>
          <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={16} /><input className="w-full pl-9 p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500" placeholder="Buscar serviço..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filtered.map(s => (
            <div key={s.id} onClick={() => { setEditingId(s.id); setIsCreating(false); setForm({ ...s }); }} className={`p-4 rounded-xl border transition-all cursor-pointer hover:bg-slate-50 relative group ${editingId === s.id ? 'border-brand-500 bg-brand-50/30 ring-1 ring-brand-500' : 'border-slate-100'}`}>
              <div className="font-bold text-sm text-slate-800 flex items-center justify-between">{s.name} {s.is_emergency && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black uppercase">Emergência</span>}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{s.category}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 pl-2 overflow-y-auto">
        {(isCreating || editingId) ? (
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-black text-xl text-slate-800">{isCreating ? 'Novo Serviço' : 'Editando Serviço'}</h3>
              <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Nome do Serviço</label><input className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Categoria</label><select className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none appearance-none" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Telefone</label><input className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="190 ou (12) 39XX-XXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Horário</label><input className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="24h ou Seg a Sex, 08h-18h" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Endereço</label><input className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
              <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Ícone</label><select className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" value={form.icon_type} onChange={e => setForm({ ...form, icon_type: e.target.value })}>{ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}</select></div>
            </div>
            <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Descrição</label><textarea className="w-full border border-slate-200 p-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none resize-none" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer group hover:bg-slate-100 transition-colors border border-slate-100"><input type="checkbox" checked={form.is_emergency} onChange={e => setForm({ ...form, is_emergency: e.target.checked })} className="w-5 h-5 rounded-md border-slate-300 text-red-600 focus:ring-red-500" /><div className="flex flex-col"><span className="text-sm font-black text-slate-800">Serviço de Emergência</span><span className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Aparece destacado com selo vermelho na interface</span></div></label>
            <div className="flex gap-3 pt-4 border-t border-slate-50">
              <button type="submit" disabled={isSaving} className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-black hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">{isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />} {isCreating ? 'Criar Serviço' : 'Salvar Alterações'}</button>
              {!isCreating && <button type="button" onClick={handleDelete} className="px-6 border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors"><Trash2 size={20} /></button>}
            </div>
          </form>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-50 rounded-3xl p-12 text-center"><div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Phone size={40} className="text-slate-200" /></div><h4 className="font-black text-slate-600 text-lg">Gestão de Utilidade Pública</h4><p className="text-sm text-slate-400 mt-2 max-w-xs">Selecione um item ao lado para editar ou clique em "Novo Serviço" para cadastrar.</p></div>
        )}
      </div>
    </div>
  );
}
