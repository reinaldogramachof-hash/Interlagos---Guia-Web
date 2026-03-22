import React from 'react';
import { Heart } from 'lucide-react';

export default function FavoritesTab({ loading, favorites }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Meus Favoritos</h3>
            {loading ? (
                <p className="text-center text-slate-400">Carregando...</p>
            ) : favorites.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Você ainda não tem favoritos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map(fav => (
                        <div key={fav.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                                {fav.image ? <img src={fav.image} className="w-full h-full object-cover rounded-lg" onError={e => { e.target.onerror=null; e.target.src='/placeholder.jpg'; }} /> : '❤️'}
                            </div>
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase">{fav.type === 'merchant' ? 'Comércio' : fav.type}</span>
                                <h4 className="font-bold text-slate-900 dark:text-white">{fav.name || fav.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
