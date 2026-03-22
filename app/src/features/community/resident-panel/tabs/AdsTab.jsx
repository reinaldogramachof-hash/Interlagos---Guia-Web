import React from 'react';
import { Star, PlusCircle } from 'lucide-react';

export default function AdsTab({ loading, myActivities, currentUser }) {
    const ads = myActivities.filter(a => a.type === 'Anúncio');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Meus Anúncios</h3>
                <div className="flex items-center gap-4">
                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> {currentUser.credits || 0} Créditos
                    </div>
                    <button className="text-indigo-600 font-bold text-sm hover:underline">Comprar +</button>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-slate-400">Carregando...</p>
            ) : ads.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500">Você ainda não tem anúncios.</p>
                    <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto">
                        <PlusCircle size={18} /> Criar Anúncio
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {ads.map(ad => (
                        <div key={ad.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                                    {ad.image && <img src={ad.image} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{ad.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-pill ${ad.status === 'active' || ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {ad.status === 'active' || ad.status === 'approved' ? 'Ativo' : 'Inativo'}
                                        </span>
                                        {ad.isHighlighted && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Star size={10} fill="currentColor" /> Destaque</span>}
                                    </div>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                                Destacar (1 Crédito)
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
