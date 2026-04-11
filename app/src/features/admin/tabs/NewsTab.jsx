import { useState, useEffect } from 'react';
import { adminFetchNews, createNews, adminDeleteNews, uploadNewsImage } from '../../../services/newsService';
import { useAuth } from '../../auth/AuthContext';
import { Bell, Trash2, Loader2, X } from 'lucide-react';
import { useToast } from '../../../components/Toast';

export default function NewsTab() {
  const { currentUser } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const showToast = useToast();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchNews = async () => {
    try {
      const data = await adminFetchNews();
      setNewsList(data);
    } catch (error) {
      // silenced for production
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    const f = e.target;
    setIsPublishing(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        try {
          imageUrl = await uploadNewsImage(imageFile);
        } catch {
          showToast('Erro ao enviar imagem. Tente novamente.', 'error');
          setIsPublishing(false);
          return;
        }
      }

      await createNews({
        title: f.title.value,
        content: f.content.value,
        summary: f.summary.value,
        category: f.category.value,
        author_id: currentUser.id,
        status: 'active',
        image_url: imageUrl,
      });

      f.reset();
      setImageFile(null);
      setImagePreview(null);
      showToast('Notícia publicada!', 'success');
      fetchNews();
    } catch {
      showToast('Erro ao publicar notícia.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteNews(id);
      showToast('Notícia excluída!', 'success');
      fetchNews();
    } catch (e) {
      showToast('Erro ao excluir', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h3 className="font-bold text-indigo-700 mb-4 flex items-center gap-2"><Bell size={20} /> Publicar Notícia Oficial</h3>
        <form onSubmit={handlePublish} className="space-y-4">
          <input name="title" placeholder="Título" className="w-full border p-2 rounded text-slate-900" required />
          <textarea name="summary" placeholder="Resumo (Aparece no feed)..." className="w-full border p-2 rounded text-slate-900" rows="2" required />
          <textarea name="content" placeholder="Corpo completo da notícia..." className="w-full border p-2 rounded text-slate-900" rows="5" required />
          
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file || null);
              setImagePreview(file ? URL.createObjectURL(file) : null);
            }}
            className="w-full border p-2 rounded text-slate-900 bg-white" 
          />
          {imagePreview && (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview da capa" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-2 right-2 bg-white/80 text-slate-600 rounded-full p-1 hover:bg-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          <select name="category" className="w-full border p-2 rounded text-slate-900">
            <option>Eventos</option>
            <option>Urgente</option>
            <option>Comunidade</option>
            <option>Urbanismo</option>
            <option>Saúde</option>
            <option>Trânsito</option>
            <option>Esportes</option>
            <option>Cultura</option>
            <option>Geral</option>
          </select>
          <button type="submit" disabled={isPublishing} className="w-full bg-indigo-600 text-white py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isPublishing ? <><Loader2 size={16} className="animate-spin" /> Publicando...</> : 'Publicar'}
          </button>
        </form>
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">Notícias Publicadas</h3>
        {newsList.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mb-2 inline-block">{item.category}</span>
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-500 line-clamp-2">{item.summary || item.content}</p>
              <div className="text-xs text-slate-400 mt-2">{new Date(item.created_at).toLocaleDateString('pt-BR')}</div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
          </div>
        ))}
        {newsList.length === 0 && <p className="text-slate-400 text-sm">Nenhuma notícia publicada.</p>}
      </div>
    </div>
  );
}
