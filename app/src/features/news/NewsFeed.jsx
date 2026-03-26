import { useState, useEffect } from 'react';
import { Newspaper, PlusCircle } from 'lucide-react';
import { fetchNews, subscribeNews } from '../../services/newsService';
import { hasConsent } from '../../services/consentService';
import NewsDetailModal from './NewsDetailModal';
import NewsResponsibilityModal from './NewsResponsibilityModal';
import CreateNewsModal from './CreateNewsModal';
import EmptyState from '../../components/EmptyState';
import { SkeletonNewsCard } from '../../components/SkeletonCard';
import useAuthStore from '../../stores/authStore';

const CATEGORIES = ['Todos', 'Urgente', 'Eventos', 'Geral', 'Trânsito', 'Esportes', 'Cultura', 'Obras', 'Saúde'];

import NewsCard from './NewsCard';
// ── Componente principal ──────────────────────────────────────────────────────
export default function NewsFeed() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showResponsibility, setShowResponsibility] = useState(false);
    const [showCreateNews, setShowCreateNews] = useState(false);

    const session = useAuthStore(s => s.session);
    const userId = session?.user?.id;

    useEffect(() => {
        let cancelled = false;
        const loadNews = async () => {
            try {
                const data = await fetchNews();
                if (cancelled) return;
                setNews(data ?? []);
            } catch (err) {
                if (!cancelled) setNews([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

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
        if (!userId) return; // guard — botão só aparece se logado
        const alreadyAccepted = await hasConsent(userId, 'news_responsibility');
        if (alreadyAccepted) {
            setShowCreateNews(true);
        } else {
            setShowResponsibility(true);
        }
    };

    return (
        <div className="pb-4 animate-in fade-in duration-300">

            {/* ── Banner do Jornal ── */}
            <div className="relative h-32 overflow-hidden">
                <img
                    src="/capa.jpg"
                    alt="Jornal do Bairro"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-900/30 flex items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <Newspaper size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white leading-tight">Jornal do Bairro</h2>
                            <p className="text-indigo-200 text-xs">Parque Interlagos, SJC</p>
                        </div>
                    </div>
                    {userId && (
                        <button
                            onClick={handlePublishClick}
                            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl transition-all border border-white/20"
                        >
                            <PlusCircle size={15} />
                            Publicar
                        </button>
                    )}
                </div>
            </div>

            {/* ── Filtros de Categoria ── */}
            <div className="overflow-x-auto whitespace-nowrap flex gap-2 px-3 py-3 border-b border-gray-100 bg-white sticky top-14 z-10">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-pill text-xs font-bold transition-all ${selectedCategory === cat
                                ? 'bg-brand-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat === 'Urgente' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />}
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── Feed ── */}
            {loading ? (
                <SkeletonNewsCard count={3} />
            ) : filteredNews.length === 0 ? (
                <EmptyState
                    icon={<Newspaper className="text-gray-300" size={40} />}
                    title="Nenhuma notícia aqui"
                    description="Novas publicações aparecerão aqui em breve."
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 px-1">
                    {filteredNews.map(item => (
                        <NewsCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedNews(item)}
                        />
                    ))}
                </div>
            )}

            <NewsDetailModal
                isOpen={!!selectedNews}
                onClose={() => setSelectedNews(null)}
                news={selectedNews}
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
                onCreated={() => setShowCreateNews(false)}
            />
        </div>
    );
}
