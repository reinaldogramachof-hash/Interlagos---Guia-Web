import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Share2, Newspaper } from 'lucide-react';
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

export default function NewsFeed() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);

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
        return <div className="p-8 text-center text-gray-400">Carregando notícias...</div>;
    }

    const featuredNews = news[0];
    const otherNews = news.slice(1);

    return (
        <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4">

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Newspaper className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Jornal do Bairro</h2>
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
                        <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
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
                    <h3 className="font-bold text-gray-800 text-lg">Agenda Cultural</h3>
                    <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
                        Ver tudo <ChevronRight size={16} />
                    </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="min-w-[260px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center">
                            <div className="bg-blue-50 text-blue-700 rounded-xl p-3 text-center min-w-[60px]">
                                <span className="block text-xs font-bold uppercase">NOV</span>
                                <span className="block text-2xl font-black">1{item}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">Show na Praça</h4>
                                <p className="text-xs text-gray-500 mb-2">18:00 - Praça do Laguinho</p>
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Grátis</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lista de Notícias Secundárias */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg px-1">Últimas Notícias</h3>
                {otherNews.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedNews(item)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition-all"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col justify-between py-1">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Clock size={10} /> {item.date}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-2">
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
