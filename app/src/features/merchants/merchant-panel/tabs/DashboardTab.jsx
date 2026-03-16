import React from 'react';
import { Eye, Tag, MousePointer, Lock } from 'lucide-react';

export default function DashboardTab({ merchant, myAds, onUpgrade }) {
  const getPlanLimit = (plan) => {
    switch (plan) {
      case 'basic': return 1;
      case 'pro': return 5;
      case 'premium': return 999;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Eye size={20} /></div>
            <h3 className="text-indigo-900 dark:text-indigo-100 font-bold">Visualizações</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{merchant?.views || 0}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Tag size={20} /></div>
            <h3 className="text-emerald-900 dark:text-emerald-100 font-bold">Anúncios Ativos</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{myAds.length} / {getPlanLimit(merchant?.plan)}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><MousePointer size={20} /></div>
            <h3 className="text-amber-900 dark:text-amber-100 font-bold">Cliques no Zap</h3>
          </div>
          {merchant?.plan === 'basic' ? (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
                <Lock size={16} /> Bloqueado
              </div>
              <button onClick={onUpgrade} className="text-xs text-indigo-600 font-bold hover:underline">Fazer Upgrade</button>
            </div>
          ) : (
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{merchant?.clicks || 0}</p>
          )}
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
        <h3 className="font-bold text-lg mb-4">Desempenho Mensal</h3>
        {merchant?.plan === 'basic' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Lock className="text-slate-400 mb-2" size={32} />
            <h4 className="font-bold text-slate-800">Recurso Premium</h4>
            <p className="text-slate-500 text-sm mb-4">Veja gráficos detalhados de acesso.</p>
            <button onClick={onUpgrade} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">
              Liberar Estatísticas
            </button>
          </div>
        )}
        <div className="h-48 bg-slate-50 rounded-xl flex items-end justify-around p-4 gap-2">
          {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
            <div key={i} className="w-full bg-indigo-200 rounded-t-lg" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
