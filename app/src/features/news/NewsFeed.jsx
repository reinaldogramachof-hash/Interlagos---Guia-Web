import { useState, useEffect } from 'react';
import { Newspaper, PlusCircle } from 'lucide-react';
import { fetchNews, subscribeNews, fetchCommentCounts } from '../../services/newsService';
import { hasConsent } from '../../services/consentService';
import NewsDetailModal from './NewsDetailModal';
import NewsResponsibilityModal from './NewsResponsibilityModal';
import CreateNewsModal from './CreateNewsModal';
import EmptyState from '../../components/EmptyState';
import { SkeletonNewsCard } from '../../components/SkeletonCard';
import { PageHero, SearchBar, CategoryChips } from '../../components/mobile';
import useAuthStore from '../../stores/authStore';
import NewsCard from './NewsCard';

const CATEGORIES = ['Todos', 'Urgente', 'Eventos', 'Geral', 'Trânsito', 'Esportes', 'Cultura', 'Obras', 'Saúde'];

export default function NewsFeed() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
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

        const unsubscribe = subscribeNews(loadNews);
        
        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, []);

    const filteredNews = news.filter(item => {
        const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
        const normalizedSearch = searchTerm.toLowerCase();
        const matchesSearch = item.title?.toLowerCase().includes(normalizedSearch) || 
                              item.content?.toLowerCase().includes(normalizedSearch) ||
                              item.summary?.toLowerCase().includes(normalizedSearch);
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
            setShowResponsibility(true);
        }
    };

    return (
        <div className="mobile-page animate-in fade-in duration-300">

            <div className="sticky top-14 z-20 mobile-sticky-panel pb-2 shadow-sm">
                <PageHero
                    section="news"
                    title="Jornal do Bairro"
                    subtitle="Informações úteis e reais"
                    icon={Newspaper}
                    imageSrc="/capa.jpg"
                >
                    {userId && (
                        <button
                            onClick={handlePublishClick}
                            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                        >
                            <PlusCircle size={16} aria-hidden="true" />
                            Publicar
                        </button>
                    )}
                </PageHero>

                <div className="px-3 pt-3 space-y-2">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar notícias..."
                    />
                    <CategoryChips
                        items={CATEGORIES}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        section="news"
                        getId={(item) => item}
                        getLabel={(item) => item}
                    />
                </div>
            </div>

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
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
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
                }}
            />
        </div>
    );
}
