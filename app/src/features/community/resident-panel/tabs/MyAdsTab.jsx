import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Loader2, Save, X } from 'lucide-react';
import { fetchAdsByUser, deleteAd, updateAd } from '../../../../services/adsService';
import { uploadImage } from '../../../../services/storageService';
import { processImage } from '../../../../utils/imageProcessor';
import { useToast } from '../../../../components/Toast';
import CreateAdWizard from '../../../ads/CreateAdWizard';
import ImageGrid from '../../../ads/ImageGrid';

export default function MyAdsTab({ currentUser }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImages, setEditImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await fetchAdsByUser(currentUser.id || currentUser.uid);
      setAds(data);
    } catch (err) {
      showToast('Erro ao carregar classificados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAds(); }, [currentUser?.id, currentUser?.uid]);

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este classificado?')) return;
    try {
      await deleteAd(id);
      setAds(prev => prev.filter(a => a.id !== id));
      showToast('Classificado excluído.', 'success');
    } catch {
      showToast('Erro ao excluir.', 'error');
    }
  };

  const handleOpenEdit = (ad) => {
    setExpandedId(ad.id);
    setEditForm({
      title: ad.title ?? '',
      price: ad.price != null ? String(ad.price) : '',
      whatsapp: ad.whatsapp ?? '',
      description: ad.description ?? '',
      category: ad.category ?? '',
    });
    setEditImages(
      [ad.image_url, ...(ad.gallery_urls || [])].filter(Boolean).map(url => ({ url, file: null }))
    );
  };

  const handleCancelEdit = () => { setExpandedId(null); setEditForm({}); setEditImages([]); };

  const handleAddImage = async (file) => {
    if (editImages.length >= 7) return showToast('Limite de 7 fotos.', 'error');
    try {
      const processed = await processImage(file);
      setEditImages(prev => [...prev, { url: URL.createObjectURL(processed), file: processed }]);
    } catch (e) {
      showToast('Erro ao processar imagem.', 'error');
    }
  };

  const handleRemoveImage = (i) => setEditImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSaveEdit = async (adId) => {
    setSaving(true);
    try {
      const uploadedUrls = await Promise.all(
        editImages.filter(img => img.file).map((img, idx) =>
          uploadImage('ad-images', img.file, `ads/${currentUser.id || currentUser.uid}/${Date.now()}_${idx}.jpg`)
        )
      );
      let uploadIdx = 0;
      const finalUrls = editImages.map(img => img.file ? uploadedUrls[uploadIdx++] : img.url);
      const parsedPrice = parseFloat(String(editForm.price).replace(/[^\d.,]/g, '').replace(',', '.')) || null;

      await updateAd(adId, {
        ...editForm,
        price: parsedPrice,
        image_url: finalUrls[0] || null,
        gallery_urls: finalUrls.slice(1),
      });
      showToast('Classificado atualizado!', 'success');
      handleCancelEdit();
      loadAds();
    } catch {
      showToast('Erro ao salvar.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const statusLabel = (s) => {
    if (s === 'approved' || s === 'active') return { text: 'Ativo', cls: 'bg-emerald-100 text-emerald-700' };
    if (s === 'pending') return { text: 'Em análise', cls: 'bg-yellow-100 text-yellow-700' };
    if (s === 'rejected') return { text: 'Rejeitado', cls: 'bg-red-100 text-red-700' };
    return { text: s || 'Inativo', cls: 'bg-slate-100 text-slate-700' };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Meus Classificados</h3>
        <button onClick={() => { setExpandedId(null); setShowWizard(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <PlusCircle size={16} /> Novo Classificado
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : ads.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">Nenhum classificado criado ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map(ad => {
            const st = statusLabel(ad.status);
            const isEditing = expandedId === ad.id;
            return (
              <div key={ad.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {ad.image_url && (
                      <img src={ad.image_url} alt={ad.title} loading="lazy" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{ad.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span>
                        {ad.price && <span className="text-xs font-bold text-emerald-600">R$ {Number(ad.price).toLocaleString('pt-BR')}</span>}
                        <span className="text-xs text-slate-400">{ad.created_at ? new Date(ad.created_at).toLocaleDateString('pt-BR') : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => isEditing ? handleCancelEdit() : handleOpenEdit(ad)}
                      className={`p-2.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isEditing ? 'bg-slate-100 text-slate-600' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                      {isEditing ? <X size={16} /> : <Pencil size={16} />}
                    </button>
                    <button onClick={() => handleDelete(ad.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="border-t border-slate-100 dark:border-slate-700 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <ImageGrid images={editImages} onAdd={handleAddImage} onRemove={handleRemoveImage} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Categoria</label>
                        <select value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500">
                          {['Vendas','Empregos','Imóveis','Serviços'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Preço (R$)</label>
                        <input value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))}
                          className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500" placeholder="Ex: 150,00" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Título</label>
                      <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">WhatsApp</label>
                      <input value={editForm.whatsapp} onChange={e => setEditForm(p => ({ ...p, whatsapp: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500" placeholder="Ex: 12999998888" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Descrição</label>
                      <textarea rows={3} value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleSaveEdit(ad.id)} disabled={saving}
                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                        <Save size={15} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                      <button onClick={handleCancelEdit}
                        className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center">
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

      <CreateAdWizard isOpen={showWizard} onClose={() => { setShowWizard(false); loadAds(); }} user={currentUser} />
    </div>
  );
}
