import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { uploadImage } from '../../../../services/storageService';
import { processImage } from '../../../../utils/imageProcessor';
import { useToast } from '../../../../components/Toast';
import ImageGrid from '../../../ads/ImageGrid';
import { PLANS_CONFIG } from '../../../../constants/plans';

export default function VitrinePostForm({ 
  merchant, 
  postTypes, 
  initialData, 
  onSave, 
  onCancel 
}) {
  const [form, setForm] = useState({
    type: initialData?.type || Object.keys(postTypes)[0],
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price != null ? String(initialData.price) : '',
  });
  const [images, setImages] = useState(
    [initialData?.image_url, ...(initialData?.gallery_urls || [])].filter(Boolean).map(url => ({ url, file: null }))
  );
  const [saving, setSaving] = useState(false);
  const showToast = useToast();
  
  const planConfig = PLANS_CONFIG[merchant?.plan] || PLANS_CONFIG['free'];
  const photoLimit = planConfig.postPhotoLimit || 0;

  const handleAddImage = async (file) => {
    if (images.length >= photoLimit) return showToast(`Limite de ${photoLimit} foto(s) atingido.`, 'error');
    try {
      const processed = await processImage(file);
      setImages(prev => [...prev, { url: URL.createObjectURL(processed), file: processed }]);
    } catch {
      showToast('Erro ao processar imagem.', 'error');
    }
  };

  const handleRemoveImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!form.title) return showToast('O título é obrigatório.', 'error');
    setSaving(true);
    try {
      let uploadedUrls = [];
      if (images.some(img => img.file)) {
        uploadedUrls = await Promise.all(
          images.filter(img => img.file).map((img, idx) =>
            uploadImage('merchant-images', img.file, `merchants/${merchant.id}/posts/${Date.now()}_${idx}.jpg`)
          )
        );
      }
      
      let uploadIdx = 0;
      const finalUrls = images.map(img => img.file ? uploadedUrls[uploadIdx++] : img.url);
      const parsedPrice = parseFloat(String(form.price).replace(/[^\d.,]/g, '').replace(',', '.')) || null;

      await onSave({
        ...form,
        price: parsedPrice,
        image_url: finalUrls[0] || null,
        gallery_urls: finalUrls.slice(1),
      });
      showToast('Post salvo com sucesso!', 'success');
    } catch (e) {
      showToast('Erro ao salvar.', 'error');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-indigo-200 dark:border-indigo-500/30 p-4 shrink-0 space-y-4 shadow-sm animate-in slide-in-from-top-2">
      <h4 className="font-bold text-lg">{initialData ? 'Editar Post' : 'Novo Post'}</h4>
      
      {photoLimit > 0 && (
        <ImageGrid images={images} onAdd={handleAddImage} onRemove={handleRemoveImage} />
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Tipo</label>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
            className="w-full border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            {Object.entries(postTypes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">Preço (R$) - Opcional</label>
          <input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
            className="w-full border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="Ex: 150,00" />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 block mb-1">Título</label>
        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} maxLength={100}
          className="w-full border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 block mb-1">Descrição</label>
        <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          className="w-full border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none" />
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
          <Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}
        </button>
        <button onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}
