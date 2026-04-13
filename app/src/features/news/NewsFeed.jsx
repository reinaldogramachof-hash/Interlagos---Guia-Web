import { useState, useEffect } from 'react';
import { Newspaper, PlusCircle } from 'lucide-react';
import { fetchNews, subscribeNews, fetchCommentCounts } from '../../services/newsService';
import { hasConsent } from '../../services/consentService';
import NewsDetailModal from './NewsDetailModal';
import NewsResponsibilityModal from './NewsResponsibilityModal';
import CreateNewsModal from './CreateNewsModal';
import EmptyState from '../../components/EmptyState';
import { SkeletonNewsCard } from '../../components/SkeletonCard';
import useAuthStore from '../../stores/authStore';

const CATEGORIES = ['Todos', 'Urgente', 'Eventos', 'Geral', 'Trânsito', 'Esportes', 'Cultura', 'Obras', 'Saúde'];

import NewsCard from './NewsCard';

export default function NewsFeed() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showResponsibility, setShowResponsibility] = useState(false);
    const [showCreateNews, setShowCreateNews] = useState(false);
    const [commentCounts, setCommentCounts] = useState({});

    const session = useAuthStore(s => s.session);
    const userId = session?.user?.id;
    const currentUser = session?.user ?? null;

    useEffect(() => {
        let cancelled = false;
        
        const loadNews = async () => {
            try {
                const data = await fetchNews();
                if (cancelled) return;
                setNews(data ?? []);

                // Buscar contagem de comentários em batch
                if (data?.length > 0) {
                    const counts = await fetchCommentCounts(data.map(n => n.id));
                    if (!cancelled) setCommentCounts(counts);
                }
            } catch (err) {
                console.error('NewsFeed load error:', err);
                if (!cancelled) setNews([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        // O subscribeNews já faz a chamada inicial de loadNews internamente via callback
        const unsubscribe = subscribeNews(loadNews);
        
        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, []);

    const filteredNews = selectedCategory === 'Todos'
        ? news
        : news.filter(item => item.category === selectedCategory);

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

            {/* Banner do Jornal */}
            <div className="relative h-32 overflow-hidden shadow-md">
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

            {/* Filtros de Categoria */}
            <div className="overflow-x-auto whitespace-nowrap flex gap-2 px-3 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-14 z-10 no-scrollbar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat
                                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        {cat === 'Urgente' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                        {cat}
                    </button>
                ))}
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
