import { Medal, Calendar, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const MemberPanelView = ({ onNavigate, onRequireAuth }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
      return (
        <div className="p-6 bg-white min-h-screen flex flex-col items-center justify-center gap-4">
          <Medal className="w-12 h-12 text-slate-300" />
          <p className="text-slate-500 text-sm text-center">Faça login para ver seu plano de membro</p>
          <button
            onClick={onRequireAuth}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-pill text-sm transition-colors"
          >
            Fazer login
          </button>
        </div>
      );
    }
    const activeBenefits = [
        'Voto nas enquetes do bairro',
        'Badge "Apoiador" no perfil',
        'Painel de transparência',
        'Nome na lista pública'
    ];

    return (
        <div className="p-4 bg-white min-h-screen">
            {/* Header */}
            <div className="mb-8 p-1">
                <div className="flex items-center gap-3 mb-2">
                    <Medal className="w-8 h-8 text-brand-600" />
                    <h1 className="text-2xl font-bold text-slate-900">Meu Plano de Membro</h1>
                </div>
                <p className="text-slate-500 text-sm">Gerencie seu apoio à comunidade</p>
            </div>

            {/* Current Member Card */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 border-0 rounded-card p-6 shadow-2xl mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-brand-100 text-[10px] font-bold uppercase tracking-widest mb-1 block">Seu Plano Atual</span>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            Apoiador
                            <Star className="w-5 h-5 fill-white text-white" />
                        </h2>
                    </div>
                    <div className="bg-white/10 p-2 rounded-card backdrop-blur-md">
                        <Medal className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="flex items-center gap-2 text-white/80 mb-8 border-t border-white/5 pt-4">
                    <Calendar className="w-3.5 h-3.5 text-brand-200" />
                    <span className="text-xs">Membro desde Março 2025</span>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-tighter mb-2 opacity-60">Seus Benefícios Ativos</h3>
                    {activeBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                            <span className="text-xs text-white/80 font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                                {benefit}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transparency stats (static) */}
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Impacto da Rede</h4>
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { label: 'Membros', val: '--' },
                    { label: 'Arrecadado', val: '--' },
                    { label: 'Ações', val: '--' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 rounded-card p-3 flex flex-col items-center">
                        <span className="text-slate-900 text-lg font-bold mb-0.5">{stat.val}</span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Upgrade CTA */}
            <button 
                onClick={() => onNavigate('members-landing')}
                className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold py-4 rounded-pill shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
                Fazer Upgrade
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default MemberPanelView;
