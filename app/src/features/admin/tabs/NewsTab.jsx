import { useState, useEffect } from 'react';
import { adminFetchNews, createNews, deleteNews } from '../../../services/newsService';
import { useAuth } from '../../auth/AuthContext';
import { Bell, Trash2 } from 'lucide-react';
import { uploadImage } from '../../../services/storageService';
import { useToast } from '../../../components/Toast';

export default function NewsTab() {
  const { currentUser } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const { showToast } = useToast();
  const [imageFile, setImageFile] = useState(null);

  const fetchNews = async () => {
    try {
      const data = await adminFetchNews();
      setNewsList(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    const f = e.target;
    
    try {
      let image_url = '';
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `news/${currentUser.uid}/${Date.now()}.${ext}`;
        image_url = await uploadImage('news-images', imageFile, path);
      }

      await createNews({
        title: f.title.value,
        content: f.content.value,
        summary: f.summary.value,
        category: f.category.value,
        author_id: currentUser.uid,
        status: 'active',
        image_url
      });

      f.reset();
      setImageFile(null);
      showToast('Notícia publicada!', 'success');
      fetchNews();
    } catch (error) {
      console.error(error);
      showToast('Erro ao publicar notícia', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNews(id);
      showToast('Notícia excluída!', 'success');
      fetchNews();
    } catch (e) {
      console.error(e);
      showToast('Erro ao excluir', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2"><Bell size={20} /> Publicar Notícia Oficial</h3>
        <form onSubmit={handlePublish} className="space-y-4">
          <input name="title" placeholder="Título" className="w-full border p-2 rounded text-slate-900" required />
          <textarea name="summary" placeholder="Resumo (Aparece no feed)..." className="w-full border p-2 rounded text-slate-900" rows="2" required />
          <textarea name="content" placeholder="Corpo completo da notícia..." className="w-full border p-2 rounded text-slate-900" rows="5" required />
          
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full border p-2 rounded text-slate-900 bg-white" 
          />
          
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Publicar</button>
        </form>
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">Notícias Publicadas</h3>
        {newsList.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2 inline-block">{item.category}</span>
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
