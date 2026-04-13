import { Lock, Eye, MousePointer, TrendingUp, BarChart3 } from 'lucide-react';
import { PLANS_CONFIG, hasPlanAccess } from '../../../../constants/plans';

const COLOR_MAP = {
  indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-900/20',   border: 'border-indigo-100 dark:border-indigo-800',   icon: 'text-indigo-600',  value: 'text-indigo-700 dark:text-indigo-300'  },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',     border: 'border-amber-100 dark:border-amber-800',     icon: 'text-amber-600',   value: 'text-amber-700 dark:text-amber-300'    },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', icon: 'text-emerald-600', value: 'text-emerald-700 dark:text-emerald-300' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-900/20',       border: 'border-rose-100 dark:border-rose-800',       icon: 'text-rose-600',    value: 'text-rose-700 dark:text-rose-300'      },
  blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',       border: 'border-blue-100 dark:border-blue-800',       icon: 'text-blue-600',    value: 'text-blue-700 dark:text-blue-300'      },
  slate:   { bg: 'bg-slate-50 dark:bg-slate-900/20',     border: 'border-slate-100 dark:border-slate-700',     icon: 'text-slate-600',   value: 'text-slate-700 dark:text-slate-300'    },
};

function StatCard({ icon: Icon, label, value, color }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.slate;
  return (
    <div className={`${c.bg} border ${c.border} p-4 md:p-5 rounded-2xl`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${c.bg} ${c.icon}`}><Icon size={18} /></div>
        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{label}</span>
      </div>
      <p className={`text-2xl md:text-3xl font-bold ${c.value}`}>{value}</p>
    </div>
  );
}

export default function ReportsTab({ merchant, onUpgrade }) {
  const hasPro = hasPlanAccess(merchant?.plan ?? 'free', 'pro');

  if (!hasPro) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Lock className="text-slate-300 mb-4" size={48} />
        <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Recurso Pro</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">
          Acompanhe visualizações, cliques e desempenho do seu negócio. Disponível a partir do plano Pro.
        </p>
        <button onClick={onUpgrade} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          Ver Planos
        </button>
      </div>
    );
  }

  const views = merchant?.views ?? 0;
  const clicks = merchant?.clicks ?? 0;
  const conversion = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Relatório de Desempenho</h3>
        <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full">Últimos 30 dias</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <StatCard icon={Eye} label="Visualizações" value={views} color="indigo" />
        <StatCard icon={MousePointer} label="Cliques no Zap" value={clicks} color="amber" />
        <StatCard icon={TrendingUp} label="Conversão" value={`${conversion}%`} color="emerald" />
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 md:p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-slate-400" size={20} />
          <h4 className="font-bold text-slate-700 dark:text-slate-200">Evolução Semanal</h4>
        </div>
        {!hasPlanAccess(merchant?.plan ?? 'free', 'premium') && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
            <Lock className="text-slate-300 mb-2" size={24} />
            <p className="text-sm text-slate-500 font-medium">Gráfico detalhado disponível no Premium</p>
            <button onClick={onUpgrade} className="text-xs text-indigo-600 font-bold hover:underline mt-1">Fazer Upgrade</button>
          </div>
        )}
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-sm font-semibold text-slate-500">Evolução semanal</p>
          <p className="text-xs text-slate-400 mt-1">Analytics detalhados em breve</p>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4 md:p-5">
        <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">Dica de Performance</h4>
        <p className="text-indigo-700 dark:text-indigo-300 text-sm">
          {clicks === 0 ? 'Nenhum clique ainda. Adicione mais fotos e atualize sua descrição para aumentar o engajamento.' :
           conversion < 5 ? 'Sua taxa de conversão está abaixo de 5%. Considere adicionar promoções ou atualizar suas fotos.' :
           'Ótimo desempenho! Continue atualizando seu perfil regularmente para manter o engajamento alto.'}
        </p>
      </div>
    </div>
  );
}
