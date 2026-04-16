import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Pencil, Trash2, Power, ShoppingBag, Wrench, Megaphone, Percent, Loader2, ImageIcon } from 'lucide-react';
import { PLANS_CONFIG } from '../../../../constants/plans';
import { 
  getMerchantPosts, 
  createMerchantPost, 
  updateMerchantPost, 
  deleteMerchantPost, 
  toggleMerchantPostActive 
} from '../../../../services/merchantPostsService';
import VitrinePostForm from './VitrinePostForm';

const POST_TYPES = {
  product: { label: 'Produto',  icon: ShoppingBag, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  service: { label: 'Serviço',  icon: Wrench,      color: 'bg-amber-100 text-amber-700 border-amber-200' },
  news:    { label: 'Novidade', icon: Megaphone,   color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  promo:   { label: 'Promoção', icon: Percent,     color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

export default function VitrineTab({ merchant, onUpgrade }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const planConfig = Object.assign({}, PLANS_CONFIG['free'], PLANS_CONFIG[merchant?.plan]);
  const postLimit = planConfig.postLimit || 0;
  const planLevel = merchant?.plan || 'free';

  const availableTypes = useMemo(() => {
    const types = { product: POST_TYPES.product, service: POST_TYPES.service };
    if (['pro', 'premium'].includes(planLevel)) types.news = POST_TYPES.news;
    if (planLevel === 'premium') types.promo = POST_TYPES.promo;
    return types;
  }, [planLevel]);

  const loadPosts = async () => {
    setLoading(true);
    const data = await getMerchantPosts(merchant.id);
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (merchant?.id) loadPosts();
  }, [merchant?.id]);

  const handleSave = async (data) => {
    if (editingPost) {
      await updateMerchantPost(editingPost.id, data);
    } else {
      await createMerchantPost(merchant.id, merchant.neighborhood, data);
    }
    setShowForm(false);
    setEditingPost(null);
    loadPosts();
  };

  const handleToggleActive = async (post) => {
    await toggleMerchantPostActive(post.id, !post.is_active);
    loadPosts();
  };

  const handleDelete = async (id) => {
    await deleteMerchantPost(id);
    setDeletingId(null);
    loadPosts();
  };

  const activeCount = posts.filter(p => p.is_active).length;
  const limitReached = activeCount >= postLimit && postLimit < 999;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Minha Vitrine</h3>
          <p className="text-sm text-slate-500">{activeCount} / {postLimit >= 999 ? '∞' : postLimit} posts ativos</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {!showForm && !editingPost && (
            <button
              onClick={limitReached ? onUpgrade : () => setShowForm(true)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                limitReached
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
              }`}
            >
              <PlusCircle size={18} /> Novo Post
            </button>
          )}
          {limitReached && !showForm && !editingPost && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 animate-pulse">
              Limite atingido · <button onClick={onUpgrade} className="underline">Fazer upgrade</button>
            </span>
          )}
        </div>
      </div>

      {(showForm || editingPost) && (
        <VitrinePostForm 
          merchant={merchant}
          postTypes={availableTypes}
          initialData={editingPost}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingPost(null); }}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : posts.length === 0 && !showForm && !editingPost ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <ImageIcon className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={48} />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Você ainda não tem posts na vitrine.</p>
          <p className="text-sm text-slate-400 mb-4 mt-1">Adicione produtos ou serviços para seus clientes.</p>
          <button onClick={() => setShowForm(true)} className="text-indigo-600 font-bold hover:underline">
            Criar primeiro post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map(post => {
            const TypeIcon = availableTypes[post.type]?.icon || POST_TYPES.product.icon;
            const typeColor = availableTypes[post.type]?.color || POST_TYPES.product.color;
            const typeLabel = availableTypes[post.type]?.label || post.type;
            
            return (
              <div key={post.id} className={`bg-white dark:bg-slate-800 rounded-xl border ${post.is_active ? 'border-slate-200 dark:border-slate-700' : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50'} shadow-sm overflow-hidden transition-all flex flex-col sm:flex-row group`}>
                <div className="w-full sm:w-32 h-32 bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className={`w-full h-full object-cover ${!post.is_active && 'grayscale opacity-50'}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600"><ImageIcon size={32} /></div>
                  )}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${typeColor}`}>
                    <TypeIcon size={10} /> {typeLabel}
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`font-bold text-lg truncate ${!post.is_active ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>{post.title}</h4>
                      {post.price != null && (
                        <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg text-sm whitespace-nowrap">R$ {Number(post.price).toLocaleString('pt-BR')}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{post.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${post.is_active ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>
                      {post.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleToggleActive(post)} className={`p-2 rounded-lg transition-colors ${post.is_active ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`} title={post.is_active ? "Pausar" : "Ativar"}>
                        <Power size={18} />
                      </button>
                      <button onClick={() => { setEditingPost(post); setShowForm(false); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                        <Pencil size={18} />
                      </button>
                      {deletingId === post.id ? (
                        <div className="flex gap-2 items-center bg-red-50 dark:bg-red-900/20 p-1 px-2 rounded-lg">
                          <button onClick={() => handleDelete(post.id)} className="text-xs font-bold text-red-600 hover:underline">Apagar</button>
                          <button onClick={() => setDeletingId(null)} className="text-xs text-slate-500 hover:underline">Cancelar</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(post.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
