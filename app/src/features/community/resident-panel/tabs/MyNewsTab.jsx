import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Loader2, Pencil, Save, X, Camera } from 'lucide-react';
import { fetchNewsByAuthor, deleteNews, updateNews } from '../../../../services/newsService';
import { uploadImage } from '../../../../services/storageService';
import { processImage } from '../../../../utils/imageProcessor';
import { useToast } from '../../../../components/Toast';

const NEWS_CATEGORIES = ['Comunidade', 'Segurança', 'Eventos', 'Infraestrutura', 'Saúde', 'Educação'];

export default function MyNewsTab({ currentUser, onCreateNews }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImage, setEditImage] = useState(null); // { url, file } | null
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await fetchNewsByAuthor(currentUser.id);
      setNews(data);
    } catch {
      showToast('Erro ao carregar notícias.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNews(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta notícia?')) return;
    try {
      await deleteNews(id, currentUser.id);
      setNews(prev => prev.filter(n => n.id !== id));
      showToast('Notícia excluída.', 'success');
    } catch {
      showToast('Erro ao excluir.', 'error');
    }
  };

  const handleOpenEdit = (item) => {
    setExpandedId(item.id);
    setEditForm({ title: item.title ?? '', content: item.content ?? '', category: item.category ?? '' });
    setEditImage(item.image_url ? { url: item.image_url, file: null } : null);
  };

  const handleCancelEdit = () => { setExpandedId(null); setEditForm({}); setEditImage(null); };

  const handleImageChange = async (file) => {
    if (!file) return;
    try {
      const processed = await processImage(file);
      setEditImage({ url: URL.createObjectURL(processed), file: processed });
    } catch { showToast('Erro ao processar imagem.', 'error'); }
  };

  const handleSaveEdit = async (id) => {
    setSaving(true);
    try {
      let imageUrl = editImage?.url ?? null;
      if (editImage?.file) {
        imageUrl = await uploadImage('news-images', editImage.file, `news/${currentUser.id}/${Date.now()}.jpg`);
      }
      await updateNews(id, { ...editForm, image_url: imageUrl });
      showToast('Notícia atualizada!', 'success');
      handleCancelEdit();
      loadNews();
    } catch { showToast('Erro ao salvar.', 'error'); }
    finally { setSaving(false); }
  };

  const statusLabel = (s) => {
    if (s === 'active') return { text: 'Publicada', cls: 'bg-emerald-100 text-emerald-700' };
    if (s === 'pending') return { text: 'Em análise', cls: 'bg-yellow-100 text-yellow-700' };
    if (s === 'rejected') return { text: 'Rejeitada', cls: 'bg-red-100 text-red-700' };
    return { text: s || 'Rascunho', cls: 'bg-slate-100 text-slate-700' };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Minhas Notícias</h3>
        <button onClick={onCreateNews} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
          <PlusCircle size={16} /> Nova Notícia
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : news.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">Nenhuma notícia publicada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map(item => {
            const st = statusLabel(item.status);
            const isEditing = expandedId === item.id;
            return (
              <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="p-4 flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.title} loading="lazy" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span>
                        {item.category && <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{item.category}</span>}
                        <span className="text-[10px] text-slate-400">{item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => isEditing ? handleCancelEdit() : handleOpenEdit(item)}
                      className={`p-2.5 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${isEditing ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}>
                      {isEditing ? <X size={16} /> : <Pencil size={16} />}
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="border-t border-slate-100 dark:border-slate-700 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {/* Imagem */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Foto da Notícia</label>
                      <label className="block w-full h-24 md:h-32 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                        {editImage ? (
                          <img src={editImage.url} className="w-full h-full object-cover" alt="preview" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400">
                            <Camera size={20} /><span className="text-xs">Trocar foto</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleImageChange(e.target.files[0])} />
                      </label>
                    </div>
                    {/* Categoria */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Categoria</label>
                      <select value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500">
                        {NEWS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {/* Título */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Título</label>
                      <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500" />
                    </div>
                    {/* Conteúdo */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Conteúdo da Notícia</label>
                      <textarea rows={4} value={editForm.content} onChange={e => setEditForm(p => ({ ...p, content: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none" />
                    </div>
                    {/* Ações */}
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleSaveEdit(item.id)} disabled={saving}
                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-colors">
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
