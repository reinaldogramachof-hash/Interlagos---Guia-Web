import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronRight, MapPin, Clock, Newspaper } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function NewsFeed() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock Data para Agenda e Destaque (Garantindo visual premium imediato)
    const featuredNews = {
        id: 'feat1',
        tag: 'Urgente',
        title: 'Reforma da Ponte de Interlagos começa nesta segunda',
        image: 'https://images.unsplash.com/photo-1590845947698-8924d7409b56?auto=format&fit=crop&q=80&w=600',
        summary: 'Trânsito será desviado por 15 dias. Veja as rotas alternativas para evitar congestionamento no horário de pico.',
        date: 'Hoje, 08:00'
    };

    const agenda = [
        {
            id: 1,
            title: 'Feira de Artesanato',
            date: 'Sáb, 14:00',
            location: 'Praça do Autódromo',
            image: 'https://images.unsplash.com/photo-1469406396016-013bfae5d83e?auto=format&fit=crop&q=80&w=200'
        },
        {
            id: 2,
            title: 'Show de Rock Local',
            date: 'Dom, 18:00',
            location: 'Centro Cultural',
            image: 'https://images.unsplash.com/photo-1459749411177-0473ef7161a9?auto=format&fit=crop&q=80&w=200'
        }
    ];

    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">

            {/* Header Jornal */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div>
                    <h2 className="font-bold text-2xl text-gray-900 font-serif">Interlagos News</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">O seu jornal diário</p>
                </div>
                <Newspaper className="text-gray-300" size={32} />
            </div>

            {/* Destaque do Dia */}
            <div className="mb-8 relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-3xl z-10" />
                <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className="w-full h-64 object-cover rounded-3xl shadow-lg group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                        {featuredNews.tag}
                    </span>
                    <h3 className="text-2xl font-bold leading-tight mb-2 font-serif">{featuredNews.title}</h3>
                    <p className="text-gray-200 text-sm line-clamp-2 mb-3">{featuredNews.summary}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={12} /> {featuredNews.date}
                    </div>
                </div>
            </div>

            {/* Agenda Cultural */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <Calendar className="text-indigo-600" size={20} />
                    <h3 className="font-bold text-gray-800 text-lg">Agenda Cultural</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {agenda.map(item => (
                        <div key={item.id} className="min-w-[240px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
                            <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                            <div>
                                <span className="text-indigo-600 text-xs font-bold block mb-1">{item.date}</span>
                                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{item.title}</h4>
                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                    <MapPin size={10} /> {item.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Últimas Notícias (Firebase + Fallback) */}
            <div>
                <h3 className="font-bold text-gray-800 text-lg mb-4 px-1">Últimas do Bairro</h3>
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div></div>
                    ) : news.length > 0 ? (
                        news.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                                )}
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">{item.tag || 'Geral'}</span>
                                    <h4 className="font-bold text-gray-800 leading-tight mb-2">{item.title}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2">{item.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 text-sm">Nenhuma outra notícia no momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
