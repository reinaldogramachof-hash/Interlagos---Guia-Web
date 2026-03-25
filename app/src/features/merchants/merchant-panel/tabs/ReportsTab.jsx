import { Lock, Eye, MousePointer, TrendingUp, BarChart3 } from 'lucide-react';
import { PLANS_CONFIG, hasPlanAccess } from '../../../../constants/plans';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`bg-${color}-50 border border-${color}-100 p-5 rounded-2xl`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 bg-${color}-100 rounded-lg text-${color}-600`}><Icon size={18} /></div>
        <span className={`font-bold text-${color}-900 text-sm`}>{label}</span>
      </div>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );
}

export default function ReportsTab({ merchant, onUpgrade }) {
  const hasPro = hasPlanAccess(merchant?.plan ?? 'free', 'pro');

  if (!hasPro) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Lock className="text-slate-300 mb-4" size={48} />
        <h3 className="font-bold text-xl text-slate-800 mb-2">Recurso Pro</h3>
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
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Relatório de Desempenho</h3>
        <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full">Últimos 30 dias</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Eye} label="Visualizações" value={views} color="indigo" />
        <StatCard icon={MousePointer} label="Cliques no Zap" value={clicks} color="amber" />
        <StatCard icon={TrendingUp} label="Conversão" value={`${conversion}%`} color="emerald" />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-slate-400" size={20} />
          <h4 className="font-bold text-slate-700">Evolução Semanal</h4>
        </div>
        {!hasPlanAccess(merchant?.plan ?? 'free', 'premium') && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
            <Lock className="text-slate-300 mb-2" size={24} />
            <p className="text-sm text-slate-500 font-medium">Gráfico detalhado disponível no Premium</p>
            <button onClick={onUpgrade} className="text-xs text-indigo-600 font-bold hover:underline mt-1">Fazer Upgrade</button>
          </div>
        )}
        <div className="h-32 flex items-end justify-around gap-2">
          {[30, 50, 40, 70, 55, 80, 65].map((h, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-1">
              <div className="w-full bg-indigo-200 rounded-t-lg" style={{ height: `${h}%`, minHeight: '8px' }} />
              <span className="text-xs text-slate-400">{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <h4 className="font-bold text-indigo-900 mb-2">Dica de Performance</h4>
        <p className="text-indigo-700 text-sm">
          {clicks === 0 ? 'Nenhum clique ainda. Adicione mais fotos e atualize sua descrição para aumentar o engajamento.' :
           conversion < 5 ? 'Sua taxa de conversão está abaixo de 5%. Considere adicionar promoções ou atualizar suas fotos.' :
           'Ótimo desempenho! Continue atualizando seu perfil regularmente para manter o engajamento alto.'}
        </p>
      </div>
    </div>
  );
}
