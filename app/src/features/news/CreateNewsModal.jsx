import { useState, useRef } from 'react';
import { X, Send, Camera, AlertCircle } from 'lucide-react';
import { createNews } from '../../services/newsService';
import { uploadImage } from '../../services/storageService';
import { useToast } from '../../components/Toast';
import { processImage } from '../../utils/imageProcessor';

const NEWS_CATEGORIES = ['Geral', 'Eventos', 'Urgente', 'Trânsito', 'Esportes', 'Cultura', 'Obras', 'Saúde'];

/**
 * Modal de criação de notícia para moradores.
 * Ajustado para não ultrapassar os limites da tela (max-height e scrolling).
 */
export default function CreateNewsModal({ isOpen, userId, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Geral');
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const showToast = useToast();

  if (!isOpen) return null;

  const isTitleValid = title.trim().length >= 5;
  const isContentValid = content.trim().length >= 20;
  const canSubmit = isTitleValid && isContentValid && !saving;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Imagem muito grande. Será compactada.', 'info');
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isTitleValid || !isContentValid || !userId) {
      if (!isTitleValid) showToast('Título curto demais.', 'error');
      else if (!isContentValid) showToast('Conteúdo curto demais.', 'error');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const processedFile = await processImage(imageFile);
        const path = `news/${userId}/${Date.now()}.jpg`;
        imageUrl = await uploadImage('news-images', processedFile, path);
      }

      await createNews({
        title: title.trim(),
        content: content.trim(),
        category,
        author_id: userId,
        image_url: imageUrl,
      });

      showToast('Enviado com sucesso!', 'success');
      setTitle('');
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      onCreated?.();
      onClose();
    } catch (err) {
      showToast('Erro ao publicar. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200">
      {/* Container Principal com limite de altura */}
      <div className="bg-white w-full max-w-md max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header - Fixo */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white shrink-0">
          <div>
            <h3 className="font-black text-slate-800 text-base">Nova Publicação</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jornal do Bairro</p>
          </div>
          <button onClick={onClose} className="p-1.5 -mr-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body - Rolável (flex-1 para ocupar o espaço entre header/footer) */}
        <div className="flex-1 overflow-y-auto px-5 py-5 bg-slate-50/30">
          <form id="create-news-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Título da Notícia</label>
              <input
                type="text"
                placeholder="Ex: Alagamento na rua central"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 text-base sm:text-sm shadow-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Categoria</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-slate-900 text-base sm:text-xs shadow-sm"
                >
                  {NEWS_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Imagem (Opcional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video max-h-40 bg-white border-2 border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 transition-all overflow-hidden group shadow-sm"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <Camera size={20} className="text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Anexar Foto</span>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Conteúdo</label>
              <textarea
                placeholder="Descreva o ocorrido com detalhes..."
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-900 text-base sm:text-sm shadow-sm transition-all resize-none"
              />
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
               <AlertCircle size={16} className="text-indigo-600 shrink-0" />
               <p className="text-[10px] text-indigo-700 font-medium">
                 Sua publicação passará por moderação antes de ficar pública.
               </p>
            </div>
          </form>
        </div>

        {/* Footer - Fixo no fundo */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 font-black text-[11px] hover:bg-slate-50 uppercase tracking-widest transition-all"
          >
            Sair
          </button>
          <button
            form="create-news-form"
            type="submit"
            disabled={saving}
            className={`flex-1 py-3 rounded-xl font-black text-[11px] transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg ${
              saving 
                ? 'bg-slate-100 text-slate-400' 
                : canSubmit 
                  ? 'bg-brand-600 text-white shadow-brand-600/20 active:scale-95' 
                  : 'bg-slate-200 text-slate-400'
            }`}
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
              : <><Send size={14} /> Enviar Publicação</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
