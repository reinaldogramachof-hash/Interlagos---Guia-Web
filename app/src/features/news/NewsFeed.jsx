import React, { useState, useEffect } from 'react';
import { Newspaper, Filter } from 'lucide-react';
import { fetchNews, subscribeNews } from '../../services/newsService';
import NewsDetailModal from './NewsDetailModal';
import EmptyState from '../../components/EmptyState';
import { SkeletonNewsCard } from '../../components/SkeletonCard';

// ── Mock de fallback ──────────────────────────────────────────────────────────
const mockNews = [
    {
        id: 1,
        title: 'Feira de Artesanato na Praça do Laguinho',
        content: 'Venha prestigiar os artesãos locais neste fim de semana. Comidas típicas e música ao vivo.',
        summary: 'Venha prestigiar os artesãos locais neste fim de semana. Comidas típicas e música ao vivo.',
        date: '2026-03-01T10:00:00Z',
        category: 'Eventos',
        image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
        author: 'Redação IC',
    },
    {
        id: 2,
        title: 'Nova Ciclofaixa na Av. Interlagos',
        content: 'Prefeitura anuncia início das obras para nova ciclovia que ligará o autódromo à estação.',
        summary: 'Prefeitura anuncia início das obras para nova ciclovia que ligará o autódromo à estação.',
        date: '2026-02-28T14:00:00Z',
        category: 'Urbanismo',
        image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
        author: 'Redação IC',
    },
    {
        id: 3,
        title: 'Vacinação Antirrábica neste Sábado',
        content: 'Traga seu pet para vacinar gratuitamente no posto de saúde do Parque Interlagos.',
        summary: 'Traga seu pet para vacinar gratuitamente no posto de saúde do Parque Interlagos.',
        date: '2026-02-27T08:00:00Z',
        category: 'Saúde',
        image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
        author: 'Redação IC',
    },
];

const CATEGORIES = ['Todos', 'Urgente', 'Eventos', 'Geral', 'Trânsito', 'Esportes', 'Cultura', 'Obras', 'Saúde'];

import NewsCard from './NewsCard';
// ── Componente principal ──────────────────────────────────────────────────────
export default function NewsFeed() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    useEffect(() => {
        let cancelled = false;
        const loadNews = async () => {
            try {
                const data = await fetchNews();
                if (cancelled) return;
                setNews(data?.length ? data : mockNews);
            } catch (err) {
                console.error("Erro ao buscar notícias:", err);
                if (!cancelled) setNews(mockNews);
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
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-900/30 flex items-center px-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <Newspaper size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white leading-tight">Jornal do Bairro</h2>
                            <p className="text-indigo-200 text-xs">Parque Interlagos, SJC</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Filtros de Categoria ── */}
            <div className="overflow-x-auto whitespace-nowrap flex gap-2 px-3 py-3 border-b border-gray-100 bg-white sticky top-14 z-10">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat
                                ? 'bg-indigo-600 text-white'
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
        </div>
    );
}
