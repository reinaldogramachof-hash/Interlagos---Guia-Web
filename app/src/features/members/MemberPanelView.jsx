import React from 'react';
import { Medal, Calendar, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const MemberPanelView = ({ onNavigate }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return (
            <div className="p-6 bg-zinc-950 min-h-screen flex flex-col items-center justify-center gap-4">
                <Medal className="w-12 h-12 text-zinc-700" />
                <p className="text-zinc-400 text-sm text-center">Faça login para ver seu plano de membro</p>
                <button
                    onClick={() => onNavigate('members-landing')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                    Conheça os planos
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
        <div className="p-4 bg-zinc-950 min-h-screen">
            {/* Header */}
            <div className="mb-8 p-1">
                <div className="flex items-center gap-3 mb-2">
                    <Medal className="w-8 h-8 text-purple-400" />
                    <h1 className="text-2xl font-bold text-white">Meu Plano de Membro</h1>
                </div>
                <p className="text-zinc-400 text-sm">Gerencie seu apoio à comunidade</p>
            </div>

            {/* Current Member Card */}
            <div className="bg-gradient-to-br from-purple-800/40 to-indigo-900/40 border border-purple-500/30 rounded-2xl p-6 shadow-2xl mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-1 block">Seu Plano Atual</span>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            Apoiador
                            <Star className="w-5 h-5 fill-purple-400 text-purple-400" />
                        </h2>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                        <Medal className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-300 mb-8 border-t border-white/5 pt-4">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs">Membro desde Março 2025</span>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-tighter mb-2 opacity-60">Seus Benefícios Ativos</h3>
                    {activeBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs text-white/80 font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                                {benefit}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transparency stats (static) */}
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-1">Impacto da Rede</h4>
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { label: 'Membros', val: '--' },
                    { label: 'Arrecadado', val: '--' },
                    { label: 'Ações', val: '--' }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex flex-col items-center">
                        <span className="text-white text-lg font-bold mb-0.5">{stat.val}</span>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Upgrade CTA */}
            <button 
                onClick={() => onNavigate('members-landing')}
                className="w-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
                Fazer Upgrade
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default MemberPanelView;
