import { useState } from 'react';
import { PlusCircle, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import { updateAd } from '../../../../services/adsService';
import { uploadImage } from '../../../../services/storageService';
import { processImage } from '../../../../utils/imageProcessor';
import { useToast } from '../../../../components/Toast';
import { useAuth } from '../../../auth/AuthContext';
import ImageGrid from '../../../ads/ImageGrid';

export default function AdsTab({ myAds, loading, onCreateClick, onDeleteClick, photoLimit = 1, adLimit = 1, onUpgrade }) {
  const { currentUser } = useAuth();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImages, setEditImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

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
    if (editImages.length >= Math.max(1, photoLimit)) return showToast(`Limite de ${Math.max(1, photoLimit)} foto(s) atingido.`, 'error');
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
      showToast('Anúncio atualizado!', 'success');
      handleCancelEdit();
      // Nota: o refresh dos dados deve ser tratado pelo pai ou via re-fetch local se necessário.
      // Como o AdsTab recebe myAds via props, o ideal é que o pai atualize ou o app use realtime.
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
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gerenciar Anúncios</h3>
        
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={myAds.length >= adLimit && adLimit < 999 ? onUpgrade : onCreateClick}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              myAds.length >= adLimit && adLimit < 999
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <PlusCircle size={18} /> Novo Anúncio
          </button>
          
          {myAds.length >= adLimit && adLimit < 999 && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 animate-pulse">
              Limite de {adLimit} anúncio(s) atingido · <button onClick={onUpgrade} className="underline">Fazer upgrade</button>
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : myAds.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">Você ainda não tem anúncios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myAds.map(ad => {
            const st = statusLabel(ad.status);
            const isEditing = expandedId === ad.id;
            return (
              <div key={ad.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 flex justify-between items-center bg-white dark:bg-slate-800">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      {ad.image_url ? (
                        <img src={ad.image_url} alt={ad.title} loading="lazy" className="w-full h-full object-cover" onError={e => { e.target.onerror=null; e.target.style.display='none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">🏷️</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{ad.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>
                          {st.text}
                        </span>
                        <span className="text-sm font-bold text-emerald-600">
                          {ad.price ? `R$ ${Number(ad.price).toLocaleString('pt-BR')}` : 'Sob consulta'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => isEditing ? handleCancelEdit() : handleOpenEdit(ad)} 
                      className={`p-2.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isEditing ? 'bg-slate-100 text-slate-600' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                      {isEditing ? <X size={18} /> : <Pencil size={18} />}
                    </button>
                    {pendingDeleteId === ad.id ? (
                      <div className="flex gap-2 items-center">
                        <button onClick={() => { setPendingDeleteId(null); onDeleteClick(ad.id); }} className="text-xs text-red-600 font-bold hover:underline">Confirmar</button>
                        <button onClick={() => setPendingDeleteId(null)} className="text-xs text-slate-500 hover:underline">Cancelar</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPendingDeleteId(ad.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
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
                        className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
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
