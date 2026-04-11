import { useState, useRef } from 'react';
import { X, Send, Camera } from 'lucide-react';
import { createNews } from '../../services/newsService';
import { uploadImage } from '../../services/storageService';
import { useToast } from '../../components/Toast';

const NEWS_CATEGORIES = ['Geral', 'Eventos', 'Urgente', 'Trânsito', 'Esportes', 'Cultura', 'Obras', 'Saúde'];

/**
 * Modal de criação de notícia para moradores.
 * Só é exibido após o aceite do gate de responsabilidade (NewsResponsibilityModal).
 *
 * Props:
 *   isOpen   {boolean}
 *   userId   {string}
 *   onClose  {() => void}
 *   onCreated {() => void} — chamado após criação bem-sucedida
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

  const isValid = title.trim().length >= 5 && content.trim().length >= 20;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Imagem muito grande. Máximo 2MB.', 'error');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `news/${userId}/${Date.now()}.${ext}`;
        imageUrl = await uploadImage('news-images', imageFile, path);
      }

      await createNews({
        title: title.trim(),
        content: content.trim(),
        category,
        author_id: userId,
        neighborhood: import.meta.env.VITE_NEIGHBORHOOD,
        status: 'active',
        image_url: imageUrl,
      });
      showToast('Notícia publicada com sucesso!', 'success');
      setImageFile(null);
      setImagePreview(null);
      onCreated?.();
      onClose();
    } catch (err) {
      showToast('Erro ao publicar notícia. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Publicar Notícia</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Título *</label>
            <input
              type="text"
              placeholder="Título da notícia (mín. 5 caracteres)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              minLength={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Categoria</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm"
            >
              {NEWS_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">
              Foto (opcional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-28 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <Camera size={20} className="text-slate-400" />
                  <span className="text-xs text-slate-400">Toque para adicionar foto</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Conteúdo *</label>
            <textarea
              placeholder="Descreva a notícia (mín. 20 caracteres)..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
              minLength={20}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || saving}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {saving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Send size={14} /> Enviar</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
