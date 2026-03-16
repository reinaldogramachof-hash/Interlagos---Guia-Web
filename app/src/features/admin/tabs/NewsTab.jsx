import { useState, useEffect } from 'react';
import { adminFetchNews, createNews, deleteNews } from '../../../services/newsService';
import { useAuth } from '../../../context/AuthContext';
import { Bell, Trash2 } from 'lucide-react';

export default function NewsTab() {
  const { currentUser } = useAuth();
  const [newsList, setNewsList] = useState([]);

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
    await createNews({
      title: f.title.value,
      content: f.summary.value,
      category: f.category.value,
      author_id: currentUser.uid,
      status: 'active',
    });
    f.reset();
    alert('Notícia publicada!');
    fetchNews();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta notícia?')) return;
    await deleteNews(id);
    fetchNews();
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2"><Bell size={20} /> Publicar Notícia Oficial</h3>
        <form onSubmit={handlePublish} className="space-y-4">
          <input name="title" placeholder="Título" className="w-full border p-2 rounded text-slate-900" required />
          <textarea name="summary" placeholder="Resumo..." className="w-full border p-2 rounded text-slate-900" rows="2" required />
          <select name="category" className="w-full border p-2 rounded text-slate-900">
            <option>Eventos</option><option>Urgente</option><option>Comunidade</option>
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
              <p className="text-sm text-slate-500 line-clamp-2">{item.content}</p>
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
