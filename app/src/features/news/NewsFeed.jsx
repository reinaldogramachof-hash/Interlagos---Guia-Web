import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Newspaper, Filter } from 'lucide-react';
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

const CATEGORY_COLORS = {
    Urgente: 'bg-red-100 text-red-700',
    Eventos: 'bg-purple-100 text-purple-700',
    Saúde: 'bg-green-100 text-green-700',
    Trânsito: 'bg-orange-100 text-orange-700',
    Urbanismo: 'bg-blue-100 text-blue-700',
    default: 'bg-indigo-100 text-indigo-700',
};

// Avatar colorido gerado por inicial
function AuthorAvatar({ name }) {
    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500', 'bg-violet-500'];
    const idx = (name?.charCodeAt(0) ?? 0) % colors.length;
    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${colors[idx]}`}>
            {name?.[0]?.toUpperCase() ?? 'IC'}
        </div>
    );
}

// Tempo relativo legível
function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// Estado local de likes (sem backend — prova de conceito)
function useLocalLike(id) {
    const key = `like_${id}`;
    const [liked, setLiked] = useState(() => !!localStorage.getItem(key));
    const toggle = () => {
        setLiked(v => {
            const next = !v;
            next ? localStorage.setItem(key, '1') : localStorage.removeItem(key);
            return next;
        });
    };
    return [liked, toggle];
}

// Card de notícia individual
function NewsCard({ item, onClick }) {
    const [liked, toggleLike] = useLocalLike(item.id);
    const catColor = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.default;
    const author = item.author ?? item.author_name ?? 'Interlagos Conectado';
    const imgSrc = item.image_url ?? item.image;

    const handleShare = (e) => {
        e.stopPropagation();
        const text = `*${item.title}*\n\n${item.summary || item.content || ''}\n\n📍 Parque Interlagos — via App IC`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <article className="bg-white border-b border-gray-100 pb-1 mb-1">
            {/* ── Cabeçalho ── */}
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
                <AuthorAvatar name={author} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{author}</p>
                    <p className="text-xs text-gray-400">{timeAgo(item.date || item.created_at)}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor}`}>
                    {item.category}
                </span>
            </div>

            {/* ── Título + resumo ── */}
            <div className="px-4 pb-2 cursor-pointer" onClick={onClick}>
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{item.title}</h3>
                {(item.summary || item.content) && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {item.summary || item.content}
                    </p>
                )}
            </div>

            {/* ── Imagem edge-to-edge ── */}
            {imgSrc && (
                <div className="w-full overflow-hidden cursor-pointer" onClick={onClick}>
                    <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-full object-cover"
                        style={{ maxHeight: '220px' }}
                        loading="lazy"
                    />
                </div>
            )}

            {/* ── Rodapé de ações ── */}
            <div className="flex items-center gap-1 px-3 pt-2">
                {/* Curtir */}
                <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${liked ? 'text-rose-600 bg-rose-50' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
                    Curtir
                </button>

                {/* Comentar */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <MessageCircle size={15} />
                    Comentar
                </button>

                {/* Compartilhar WhatsApp */}
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors ml-auto"
                >
                    <Share2 size={15} />
                    Compartilhar
                </button>
            </div>
        </article>
    );
}

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
