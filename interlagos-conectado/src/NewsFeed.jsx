import React, { useState, useEffect } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function NewsFeed() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                <Bell className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-500">Nenhuma notícia no momento.</p>
            </div>
        );
    }

    return (
        <section className="mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 mb-3 px-1">
                <Bell className="text-indigo-600" size={20} />
                <h2 className="font-bold text-gray-800 text-xl">Acontece no Bairro</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                {news.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-[280px] max-w-[300px] snap-center bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0"
                    >
                        {item.imageUrl && (
                            <div className="h-32 w-full overflow-hidden">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    {item.tag || 'Notícia'}
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {item.date || 'Hoje'}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 leading-tight mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                {item.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
