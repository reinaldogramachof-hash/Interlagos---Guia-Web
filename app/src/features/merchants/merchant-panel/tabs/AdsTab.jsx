import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function AdsTab({ myAds, loading, onCreateClick, onDeleteClick }) {
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gerenciar Anúncios</h3>
        <button
          onClick={onCreateClick}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={18} /> Novo Anúncio
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-400">Carregando...</p>
      ) : myAds.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">Você ainda não tem anúncios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myAds.map(ad => (
            <div key={ad.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0">
                  {ad.image_url && <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" onError={e => { e.target.onerror=null; e.target.style.display='none'; }} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{ad.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                      {ad.status === 'approved' ? 'Ativo' : ad.status === 'pending' ? 'Em Análise' : 'Inativo'}
                    </span>
                    <span className="text-xs text-slate-500">{ad.price ? `R$ ${ad.price}` : 'Sob consulta'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                {pendingDeleteId === ad.id ? (
                  <div className="flex gap-2 items-center">
                    <button onClick={() => { setPendingDeleteId(null); onDeleteClick(ad.id); }} className="text-xs text-red-600 font-bold hover:underline">Confirmar</button>
                    <button onClick={() => setPendingDeleteId(null)} className="text-xs text-slate-500 hover:underline">Cancelar</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setPendingDeleteId(ad.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
