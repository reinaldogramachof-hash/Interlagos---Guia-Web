import { useState } from 'react';
import { Newspaper, PlusCircle, Search, X } from 'lucide-react';
import { hasConsent } from '../../services/consentService';
import NewsDetailModal from './NewsDetailModal';
import NewsResponsibilityModal from './NewsResponsibilityModal';
import CreateNewsModal from './CreateNewsModal';
import EmptyState from '../../components/EmptyState';
import { SkeletonNewsCard } from '../../components/SkeletonCard';
import useAuthStore from '../../stores/authStore';
import useNewsStore, { selectNews, selectNewsLoading, selectCommentCounts } from '../../stores/newsStore';

const CATEGORIES = ['Todos', 'Urgente', 'Eventos', 'Geral', 'Trânsito', 'Esportes', 'Cultura', 'Obras', 'Saúde'];

import NewsCard from './NewsCard';

export default function NewsFeed() {
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [showResponsibility, setShowResponsibility] = useState(false);
    const [showCreateNews, setShowCreateNews] = useState(false);

    const news = useNewsStore(selectNews);
    const loading = useNewsStore(selectNewsLoading);
    const commentCounts = useNewsStore(selectCommentCounts);

    const session = useAuthStore(s => s.session);
    const userId = session?.user?.id;
    const currentUser = session?.user ?? null;

    const filteredNews = news.filter(item => {
        const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.summary?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handlePublishClick = async () => {
        if (!userId) return;
        
        try {
            const alreadyAccepted = await hasConsent(userId, 'news_responsibility');
            if (alreadyAccepted) {
                setShowCreateNews(true);
            } else {
                setShowResponsibility(true);
            }
        } catch (err) {
            console.error('Consent check error:', err);
            // Fallback para o modal de responsabilidade se falhar o check
            setShowResponsibility(true);
        }
    };

    return (
        <div className="pb-4 animate-in fade-in duration-300">

            {/* Cabecalho Fixo Integrado */}
            <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-md pb-2 shadow-sm border-b border-gray-200">
                {/* Banner do Jornal */}
                <div className="relative h-28 overflow-hidden">
                    <img
                        src="/capa.jpg"
                        alt="Jornal do Bairro"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/60 to-transparent flex items-center justify-between px-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                                <Newspaper size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white leading-tight tracking-tight">Jornal do Bairro</h2>
                                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Informaçōes Úteis e Reais</p>
                            </div>
                        </div>
                        {userId && (
                            <button
                                onClick={handlePublishClick}
                                className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                            >
                                <PlusCircle size={16} />
                                Publicar
                            </button>
                        )}
                    </div>
                </div>

                {/* Busca e Filtros de Categoria */}
                <div className="px-3 pt-3 space-y-2">
                    <div className="relative">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar notícias..."
                        className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                      />
                      {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="overflow-x-auto whitespace-nowrap flex gap-2 pb-1 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all min-h-[36px] flex items-center ${selectedCategory === cat
                                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
                                    }`}
                            >
                                {cat === 'Urgente' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feed */}
            {loading ? (
                <div className="px-3 pt-4">
                    <SkeletonNewsCard count={3} />
                </div>
            ) : filteredNews.length === 0 ? (
                <div className="py-12">
                    <EmptyState
                        icon={<Newspaper className="text-gray-200" size={60} />}
                        title="Nenhuma notícia por aqui"
                        description="As principais ocorrências e avisos do bairro aparecerão aqui."
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredNews.map(item => (
                        <NewsCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedNews(item)}
                            commentCount={commentCounts[item.id] || 0}
                        />
                    ))}
                </div>
            )}

            <NewsDetailModal
                isOpen={!!selectedNews}
                onClose={() => setSelectedNews(null)}
                news={selectedNews}
                currentUser={currentUser}
            />

            <NewsResponsibilityModal
                isOpen={showResponsibility}
                userId={userId}
                onConfirm={() => { setShowResponsibility(false); setShowCreateNews(true); }}
                onCancel={() => setShowResponsibility(false)}
            />

            <CreateNewsModal
                isOpen={showCreateNews}
                userId={userId}
                onClose={() => setShowCreateNews(false)}
                onCreated={() => {
                    setShowCreateNews(false);
                    // O subscribeNews cuidará de recarregar via realtime se necessário,
                    // mas podemos forçar um refresh se quisermos feedback imediato
                }}
            />
        </div>
    );
}
