import React from 'react';
import { Eye, Tag, MousePointer, Lock } from 'lucide-react';
import { PLANS_CONFIG } from '../../../../constants/plans';

export default function DashboardTab({ merchant, myAds, onUpgrade }) {
  const plan = PLANS_CONFIG[merchant?.plan] ?? PLANS_CONFIG['free'];
  const adLimit = plan.adLimit;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visualizações */}
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Eye size={20} /></div>
            <h3 className="text-indigo-900 font-bold">Visualizações</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{merchant?.views || 0}</p>
        </div>

        {/* Anúncios Ativos */}
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Tag size={20} /></div>
            <h3 className="text-emerald-900 font-bold">Anúncios Ativos</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            {myAds.length} / {adLimit >= 999 ? '∞' : adLimit}
          </p>
        </div>

        {/* Cliques no Zap */}
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><MousePointer size={20} /></div>
            <h3 className="text-amber-900 font-bold">Cliques no Zap</h3>
          </div>
          {plan.hasStats ? (
            <p className="text-3xl font-bold text-amber-600">{merchant?.clicks || 0}</p>
          ) : (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
                <Lock size={16} /> Bloqueado
              </div>
              <button onClick={onUpgrade} className="text-xs text-indigo-600 font-bold hover:underline">
                Fazer Upgrade
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Desempenho */}
      <div className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
        <h3 className="font-bold text-lg mb-4">Desempenho Mensal</h3>
        {!plan.hasStats && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Lock className="text-slate-400 mb-2" size={32} />
            <h4 className="font-bold text-slate-800">Recurso Pro</h4>
            <p className="text-slate-500 text-sm mb-4">Disponível a partir do plano Pro.</p>
            <button onClick={onUpgrade} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">
              Ver Planos
            </button>
          </div>
        )}
        <div className="h-48 bg-slate-50 rounded-xl flex items-end justify-around p-4 gap-2">
          {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
            <div key={i} className="w-full bg-indigo-200 rounded-t-lg" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* Banner de upgrade para free/basic */}
      {(merchant?.plan === 'free' || merchant?.plan === 'basic') && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-800">Desbloqueie mais recursos</h4>
            <p className="text-sm text-slate-500">
              {merchant?.plan === 'free'
                ? 'Faça upgrade para o plano Básico e publique até 3 anúncios.'
                : 'Upgrade para Pro: estatísticas, links sociais e anúncios ilimitados.'}
            </p>
          </div>
          <button onClick={onUpgrade} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 whitespace-nowrap">
            Ver Planos
          </button>
        </div>
      )}
    </div>
  );
}
