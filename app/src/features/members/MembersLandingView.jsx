import { Heart, Star, Zap, Crown, Info } from 'lucide-react';
import MemberTierCard from './MemberTierCard';

const MembersLandingView = ({ _onNavigate }) => {
    const tiers = [
        {
            name: 'Apoiador',
            price: '4,99',
            icon: Heart,
            perks: [
                'Voto nas enquetes do bairro',
                'Badge "Apoiador" no perfil',
                'Painel de transparência',
                'Nome na lista pública de apoiadores'
            ]
        },
        {
            name: 'Guardião',
            price: '9,99',
            icon: Zap,
            isHighlighted: true,
            perks: [
                'Tudo do Apoiador',
                'Pode propor temas para as enquetes',
                'Relatório mensal de impacto social',
                'Acesso antecipado a novos recursos',
                'Badge "Guardião" exclusiva'
            ]
        },
        {
            name: 'Fundador do Bairro',
            price: '19,99',
            icon: Crown,
            perks: [
                'Tudo do Guardião',
                'Participação em reuniões mensais da rede',
                'Canal direto com a equipe via WhatsApp',
                'Badge "Fundador" permanente e exclusiva',
                'Nome nos créditos da plataforma'
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Legend & Header */}
            <div className="pt-8 pb-10 px-6 text-center bg-gradient-to-b from-brand-50 to-transparent">
                <span className="bg-brand-50 text-brand-600 text-[10px] font-bold px-3 py-1 rounded-pill uppercase tracking-widest inline-block mb-3 border border-brand-100">
                   💜 Rede de Apoio
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-4">
                    Faça parte de quem mantém o bairro conectado
                </h1>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                    Sua contribuição direta sustenta a plataforma e apoia causas sociais na nossa comunidade.
                </p>

                {/* Transparency Panel */}
                <div className="bg-slate-50 border border-slate-100 rounded-card grid grid-cols-3 gap-2 p-4">
                    <div className="flex flex-col items-center">
                        <span className="text-slate-900 font-bold text-lg">--</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Membros Ativos</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-slate-100">
                        <span className="text-emerald-600 font-bold text-lg">--</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Arrecadado</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-brand-600 font-bold text-lg">--</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Ações Sociais</span>
                    </div>
                </div>
            </div>

            {/* Price Cards */}
            <div className="px-6 space-y-8 pb-12 overflow-x-hidden">
                {tiers.map((tier, idx) => (
                    <MemberTierCard key={idx} tier={tier} isHighlighted={tier.isHighlighted} />
                ))}
            </div>

            <div className="pb-16 px-8 text-center bg-white">
                <div className="flex items-center gap-2 justify-center mb-1">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                        Transparência em primeiro lugar
                    </p>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed px-4">
                    100% da arrecadação é reinvestida em infraestrutura tecnológica e 
                    doações para o centro comunitário local de Interlagos.
                </p>
            </div>
        </div>
    );
};

export default MembersLandingView;
