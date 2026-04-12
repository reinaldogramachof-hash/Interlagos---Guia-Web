import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Trash2, Loader2, Camera, Pencil, Save, X } from 'lucide-react';
import { fetchCampaignsByUser, deleteCampaign, createCampaign, updateCampaign } from '../../../../services/communityService';
import { uploadImage } from '../../../../services/storageService';
import { useToast } from '../../../../components/Toast';
import { processImage } from '../../../../utils/imageProcessor';

const CAMPAIGN_TYPES = [
  { value: 'donation', label: 'Doação' },
  { value: 'volunteer', label: 'Voluntariado' },
  { value: 'request', label: 'Pedido de Ajuda' },
];

export default function MyCampaignsTab({ currentUser }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const editFileRef = useRef(null);
  
  const showToast = useToast();

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await fetchCampaignsByUser(currentUser.id);
      setCampaigns(data);
    } catch {
      showToast('Erro ao carregar campanhas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCampaigns(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta campanha?')) return;
    try {
      await deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      showToast('Campanha excluída.', 'success');
    } catch {
      showToast('Erro ao excluir.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Imagem muito grande. Máximo 10MB.', 'error');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const f = e.target;

    try {
      let imageUrl = null;
      if (imageFile) {
        const processedFile = await processImage(imageFile);
        const path = `campaigns/${currentUser.id}/${Date.now()}.jpg`;
        imageUrl = await uploadImage('campaign-images', processedFile, path);
      }

      await createCampaign({
        title: f.title.value,
        description: f.description.value,
        type: f.type.value,
        end_date: f.end_date.value || null,
        neighborhood: import.meta.env.VITE_NEIGHBORHOOD,
        author_id: currentUser.id,
        status: 'pending',
        merchant_id: null,
        image_url: imageUrl,
      });
      showToast('Campanha enviada para análise!', 'success');
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      loadCampaigns();
    } catch {
      showToast('Erro ao criar campanha.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (c) => {
    setExpandedId(c.id);
    setEditForm({ title: c.title ?? '', description: c.description ?? '', type: c.type ?? 'donation', end_date: c.end_date ? c.end_date.slice(0, 10) : '' });
    setEditImageFile(null);
    setEditImagePreview(c.image_url ?? null);
  };

  const handleCancelEdit = () => { setExpandedId(null); setEditForm({}); setEditImageFile(null); setEditImagePreview(null); };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async (id) => {
    setSaving(true);
    try {
      let imageUrl = editImagePreview;
      if (editImageFile) {
        const processed = await processImage(editImageFile);
        imageUrl = await uploadImage('campaign-images', processed, `campaigns/${currentUser.id}/${Date.now()}.jpg`);
      }
      await updateCampaign(id, { ...editForm, image_url: imageUrl, status: 'pending' });
      showToast('Campanha atualizada! Aguarde análise.', 'success');
      handleCancelEdit();
      loadCampaigns();
    } catch { showToast('Erro ao salvar.', 'error'); }
    finally { setSaving(false); }
  };

  const statusLabel = (s) => {
    if (s === 'active') return { text: 'Ativa', cls: 'bg-emerald-100 text-emerald-700' };
    if (s === 'pending') return { text: 'Em análise', cls: 'bg-yellow-100 text-yellow-700' };
    if (s === 'rejected') return { text: 'Rejeitada', cls: 'bg-red-100 text-red-700' };
    return { text: s || 'Encerrada', cls: 'bg-slate-100 text-slate-700' };
  };

  const typeLabel = (t) => {
    const found = CAMPAIGN_TYPES.find(ct => ct.value === t);
    return found ? found.label : t;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Minhas Campanhas</h3>
        <button onClick={() => { setExpandedId(null); setShowForm(!showForm); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
          <PlusCircle size={16} /> Nova Campanha
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Titulo</label>
            <input name="title" required className="w-full border border-slate-200 dark:border-slate-600 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Descrição</label>
            <textarea name="description" required rows="3" className="w-full border border-slate-200 dark:border-slate-600 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Foto (opcional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors overflow-hidden"
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
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Tipo</label>
              <select name="type" className="w-full border border-slate-200 dark:border-slate-600 p-2.5 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {CAMPAIGN_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Data Fim</label>
              <input name="end_date" type="date" className="w-full border border-slate-200 dark:border-slate-600 p-2.5 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {submitting ? 'Enviando...' : 'Enviar para Análise'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 dark:text-slate-400 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">Nenhuma campanha criada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => {
            const st = statusLabel(c.status);
            const isEditing = expandedId === c.id;
            return (
              <div key={c.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="p-4 flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {c.image_url && (
                      <img src={c.image_url} alt={c.title} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{c.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span>
                        <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase">{typeLabel(c.type)}</span>
                        <span className="text-[10px] text-slate-400">{c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => isEditing ? handleCancelEdit() : handleOpenEdit(c)}
                      className={`p-2.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isEditing ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                      {isEditing ? <X size={16} /> : <Pencil size={16} />}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="border-t border-slate-100 dark:border-slate-700 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {/* Imagem */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Foto da Campanha</label>
                      <div onClick={() => editFileRef.current?.click()}
                        className="w-full h-24 md:h-28 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
                        {editImagePreview ? (
                          <img src={editImagePreview} className="w-full h-full object-cover" alt="preview" />
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-slate-400"><Camera size={20} /><span className="text-xs">Trocar foto</span></div>
                        )}
                      </div>
                      <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={handleEditFileChange} />
                    </div>
                    {/* Tipo e Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tipo</label>
                        <select value={editForm.type} onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))}
                          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 track">
                          {CAMPAIGN_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Data de Encerramento</label>
                        <input type="date" value={editForm.end_date} onChange={e => setEditForm(p => ({ ...p, end_date: e.target.value }))}
                          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    {/* Título */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Título</label>
                      <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500" />
                    </div>
                    {/* Descrição */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Descrição</label>
                      <textarea rows={3} value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none" />
                    </div>
                    {/* Ações */}
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleSaveEdit(c.id)} disabled={saving}
                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm">
                        <Save size={15} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                      <button onClick={handleCancelEdit}
                        className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
