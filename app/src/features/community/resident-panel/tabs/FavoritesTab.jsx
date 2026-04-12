import React, { useState, useEffect } from 'react';
import { Heart, Share2, Trash2, Store, Tag, Newspaper, Loader2 } from 'lucide-react';
import { getFavorites, toggleFavorite } from '../../../../services/favoritesService';

export default function FavoritesTab({ currentUser }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.id && !currentUser?.uid) {
            setLoading(false);
            return;
        }

        const loadFavorites = async () => {
            setLoading(true);
            try {
                const data = await getFavorites(currentUser.id || currentUser.uid);
                setFavorites(data || []);
            } catch (error) {
                console.error('Error loading favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [currentUser?.id, currentUser?.uid]);

    const handleRemove = async (fav) => {
        await toggleFavorite(currentUser.id || currentUser.uid, fav.entity_id, fav.entity_type);
        setFavorites(prev => prev.filter(f => f.id !== fav.id));
    };

    const handleShare = (fav) => {
        const appUrl = `${window.location.origin}${window.location.pathname}`;
        const typeLabel = { merchant: 'comércio', ad: 'anúncio', news: 'notícia' }[fav.entity_type] || 'item';
        const priceInfo = fav.entity_type === 'ad' && fav.extra ? ` — ${fav.extra}` : '';
        const text = `Vi este ${typeLabel} no Tem No Bairro: "${fav.name}"${priceInfo}. Confira! ${appUrl}`;

        if (navigator.share) {
            navigator.share({ title: fav.name, text, url: appUrl }).catch(() => {});
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }
    };

    const getEmoji = (type) => {
        if (type === 'merchant') return '🏪';
        if (type === 'ad') return '🏷️';
        if (type === 'news') return '📰';
        return '❤️';
    };

    const getBadgeStyle = (type) => {
        if (type === 'merchant') return 'bg-indigo-600/90 text-white';
        if (type === 'ad') return 'bg-amber-500/90 text-white';
        if (type === 'news') return 'bg-blue-600/90 text-white';
        return 'bg-slate-600/90 text-white';
    };

    const getBadgeLabel = (type) => {
        if (type === 'merchant') return 'Comércio';
        if (type === 'ad') return 'Classificado';
        if (type === 'news') return 'Notícia';
        return 'Item';
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Meus Favoritos</h3>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="w-full h-32 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="p-3 space-y-2">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 w-3/4 rounded"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 w-1/2 rounded"></div>
                            </div>
                            <div className="flex border-t border-slate-100 dark:border-slate-700 divide-x divide-slate-100 dark:divide-slate-700 h-10 bg-slate-50 dark:bg-slate-800"></div>
                        </div>
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Você ainda não tem favoritos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map(fav => (
                        <div key={fav.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 relative">
                                {fav.image ? (
                                    <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" onError={e => { e.target.onerror=null; e.target.style.display='none'; }} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                        {getEmoji(fav.entity_type)}
                                    </div>
                                )}
                                <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm ${getBadgeStyle(fav.entity_type)}`}>
                                    {getBadgeLabel(fav.entity_type)}
                                </span>
                            </div>

                            <div className="p-3">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">{fav.name}</h4>
                                {fav.category && (
                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <Tag size={11} /> {fav.category}
                                    </p>
                                )}
                                {fav.extra && fav.entity_type === 'ad' && (
                                    <p className="text-sm font-bold text-emerald-600 mt-1">{fav.extra}</p>
                                )}
                            </div>

                            <div className="flex border-t border-slate-100 dark:border-slate-700 divide-x divide-slate-100 dark:divide-slate-700">
                                <button onClick={() => handleShare(fav)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors">
                                    <Share2 size={14} /> Indicar
                                </button>
                                <button onClick={() => handleRemove(fav)}
                                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
