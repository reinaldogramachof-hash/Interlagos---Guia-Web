import React from 'react';
import { Heart, Star, Zap, Crown, Info } from 'lucide-react';
import MemberTierCard from './MemberTierCard';

const MembersLandingView = ({ onNavigate }) => {
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
        <div className="bg-zinc-950 min-h-screen">
            {/* Legend & Header */}
            <div className="pt-8 pb-10 px-6 text-center bg-gradient-to-b from-purple-900/20 to-transparent">
                <span className="bg-purple-600/20 text-purple-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3 border border-purple-500/20">
                   💜 Rede de Apoio
                </span>
                <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
                    Faça parte de quem mantém o bairro conectado
                </h1>
                <p className="text-zinc-400 text-sm max-w-xs mx-auto mb-8">
                    Sua contribuição direta sustenta a plataforma e apoia causas sociais na nossa comunidade.
                </p>

                {/* Transparency Panel */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl grid grid-cols-3 gap-2 p-4">
                    <div className="flex flex-col items-center">
                        <span className="text-white font-bold text-lg">--</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Membros Ativos</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-zinc-800">
                        <span className="text-green-500 font-bold text-lg">--</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Arrecadado</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-purple-500 font-bold text-lg">--</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Ações Sociais</span>
                    </div>
                </div>
            </div>

            {/* Price Cards */}
            <div className="px-6 space-y-8 pb-12 overflow-x-hidden">
                {tiers.map((tier, idx) => (
                    <MemberTierCard key={idx} tier={tier} isHighlighted={tier.isHighlighted} />
                ))}
            </div>

            <div className="pb-16 px-8 text-center bg-zinc-950">
                <div className="flex items-center gap-2 justify-center mb-1">
                    <Info className="w-3.5 h-3.5 text-zinc-600" />
                    <p className="text-[10px] text-zinc-600 font-medium tracking-tight">
                        Transparência em primeiro lugar
                    </p>
                </div>
                <p className="text-[10px] text-zinc-700 leading-relaxed px-4">
                    100% da arrecadação é reinvestida em infraestrutura tecnológica e 
                    doações para o centro comunitário local de Interlagos.
                </p>
            </div>
        </div>
    );
};

export default MembersLandingView;
