import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Share2, Newspaper, Filter } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import NewsDetailModal from './NewsDetailModal';

// Mock Data Fallback
const mockNews = [
    {
        id: 1,
        title: 'Feira de Artesanato na Praça do Laguinho',
        summary: 'Venha prestigiar os artesãos locais neste fim de semana. Comidas típicas e música ao vivo.',
        date: '12 Nov',
        category: 'Eventos',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=500',
        location: 'Praça do Laguinho'
    },
    {
        id: 2,
        title: 'Nova Ciclofaixa na Av. Interlagos',
        summary: 'Prefeitura anuncia início das obras para nova ciclovia que ligará o autódromo à estação.',
        date: '10 Nov',
        category: 'Urbanismo',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=500',
        location: 'Av. Interlagos'
    },
    {
        id: 3,
        title: 'Vacinação Antirrábica neste Sábado',
        summary: 'Traga seu pet para vacinar gratuitamente no posto de saúde do Jd. Satélite.',
        date: '08 Nov',
        category: 'Saúde',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=500',
        location: 'UBS Jd. Satélite'
    }
];

const categories = ['Todos', 'Urgente', 'Eventos', 'Geral', 'Trânsito', 'Esportes', 'Cultura', 'Obras'];

export default function NewsFeed({ user }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const q = query(collection(db, 'news'), orderBy('date', 'desc'), limit(5));
                const querySnapshot = await getDocs(q);
                const fetchedNews = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                if (fetchedNews.length === 0) {
                    setNews(mockNews);
                } else {
                    setNews(fetchedNews);
                }
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
                setNews(mockNews);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Carregando notícias...</div>;
    }

    const filteredNews = selectedCategory === 'Todos'
        ? news
        : news.filter(item => item.category === selectedCategory);

    const featuredNews = filteredNews[0];
    const otherNews = filteredNews.slice(1);

    return (
        <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4">

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 -mb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Filter size={16} />
                        {cat}
                    </button>
                ))}
            </div>

            {/* Header Card */}
            <div className="relative h-40 rounded-3xl overflow-hidden mb-6 shadow-lg group">
                <div className="absolute inset-0 bg-blue-900/20 z-10" />
                <img
                    src="/capa.jpg"
                    alt="Capa Jornal do Bairro"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/40 to-transparent z-20 flex items-center px-8">
                    <div className="text-white transform translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Newspaper size={28} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">Jornal do Bairro</h2>
                        </div>
                        <p className="text-blue-100 text-sm font-medium max-w-[250px] leading-relaxed">
                            Fique por dentro do que acontece na nossa região.
                        </p>
                    </div>
                </div>
            </div>

            {/* Destaque Principal */}
            {featuredNews && (
                <div
                    onClick={() => setSelectedNews(featuredNews)}
                    className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    <img
                        src={featuredNews.image}
                        alt={featuredNews.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                        <span className="bg-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                            {featuredNews.category}
                        </span>
                        <h3 className="text-2xl font-bold mb-2 leading-tight">{featuredNews.title}</h3>
                        <p className="text-gray-200 text-sm line-clamp-2 mb-4">{featuredNews.summary}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-300">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {featuredNews.date}
                            </div>
                            {featuredNews.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {featuredNews.location}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Agenda Cultural (Horizontal Scroll) */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Agenda Cultural</h3>
                    <button className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1">
                        Ver tudo <ChevronRight size={16} />
                    </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="min-w-[260px] bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5 flex gap-4 items-center">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl p-3 text-center min-w-[60px]">
                                <span className="block text-xs font-bold uppercase">NOV</span>
                                <span className="block text-2xl font-black">1{item}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-1">Show na Praça</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">18:00 - Praça do Laguinho</p>
                                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">Grátis</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lista de Notícias Secundárias */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg px-1">Últimas Notícias</h3>
                {otherNews.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedNews(item)}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5 flex gap-4 cursor-pointer hover:shadow-md transition-all"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col justify-between py-1">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Clock size={10} /> {item.date}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {item.summary}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <NewsDetailModal
                isOpen={!!selectedNews}
                onClose={() => setSelectedNews(null)}
                news={selectedNews}
            />
        </div>
    );
}
