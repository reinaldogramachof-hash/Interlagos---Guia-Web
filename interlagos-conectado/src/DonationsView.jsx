import React, { useState } from 'react';
import { Heart, Gift, HandHeart, ArrowRight, Building2, Users, MessageCircle, AlertCircle } from 'lucide-react';

export default function DonationsView() {
    const [activeTab, setActiveTab] = useState('campanhas');

    const campaigns = [
        {
            id: 1,
            title: "Campanha do Agasalho 2025",
            org: "Associação de Moradores",
            description: "O frio chegou! Estamos arrecadando cobertores, casacos e meias em bom estado para famílias vulneráveis.",
            target: "Meta: 500 peças",
            progress: 65,
            icon: <Gift className="text-pink-500" />,
            color: "bg-pink-50 text-pink-700 border-pink-100"
        },
        {
            id: 2,
            title: "Natal Sem Fome",
            org: "ONG Interlagos Solidário",
            description: "Doação de cestas básicas para garantir a ceia de 200 famílias cadastradas na região.",
            target: "Meta: 200 Cestas",
            progress: 30,
            icon: <HandHeart className="text-orange-500" />,
            color: "bg-orange-50 text-orange-700 border-orange-100"
        },
        {
            id: 3,
            title: "Material Escolar",
            org: "Projeto Futuro",
            description: "Arrecadação de cadernos, lápis e mochilas para crianças da rede pública.",
            target: "Meta: 100 Kits",
            progress: 80,
            icon: <Gift className="text-blue-500" />,
            color: "bg-blue-50 text-blue-700 border-blue-100"
        },
        {
            id: 4,
            title: "Ração para Todos",
            org: "Abrigo Feliz",
            description: "Ajude a alimentar mais de 50 cães resgatados. Precisamos de ração seca e úmida.",
            target: "Meta: 500kg",
            progress: 15,
            icon: <Heart className="text-red-500" />,
            color: "bg-red-50 text-red-700 border-red-100"
        }
    ];

    const ngos = [
        {
            id: 1,
            name: "Proteção Animal Zona Sul",
            cause: "Causa Animal",
            desc: "Resgate e reabilitação de cães e gatos abandonados.",
            pix: "pix@protecaoanimal.org",
            image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 2,
            name: "Casa do Zezinho",
            cause: "Educação Infantil",
            desc: "Espaço de desenvolvimento para crianças e jovens de baixa renda.",
            pix: "doar@casadozezinho.org.br",
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 3,
            name: "Lar dos Idosos",
            cause: "Assistência Social",
            desc: "Acolhimento e cuidado para idosos em situação de vulnerabilidade.",
            pix: "contato@laridosos.org",
            image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=200"
        },
        {
            id: 4,
            name: "Mãos que Ajudam",
            cause: "Combate à Fome",
            desc: "Distribuição de marmitas para pessoas em situação de rua.",
            pix: "ajuda@maos.org",
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=200"
        }
    ];

    const requests = [
        {
            id: 1,
            title: "Cadeira de Rodas",
            for: "Dona Maria (78 anos)",
            desc: "Preciso emprestada por 2 meses enquanto me recupero de uma cirurgia.",
            urgent: true
        },
        {
            id: 2,
            title: "Livros Didáticos",
            for: "João Pedro (10 anos)",
            desc: "Preciso de livros do 5º ano para acompanhar as aulas.",
            urgent: false
        },
        {
            id: 3,
            title: "Muletas",
            for: "Carlos (45 anos)",
            desc: "Quebrei a perna e preciso de muletas para me locomover.",
            urgent: true
        },
        {
            id: 4,
            title: "Roupas de Bebê",
            for: "Ana (Gestante)",
            desc: "Estou grávida de 8 meses e preciso de roupinhas para recém-nascido.",
            urgent: false
        },
        {
            id: 5,
            title: "Cama de Solteiro",
            for: "Lucas (Estudante)",
            desc: "Mudei para o bairro para estudar e preciso de uma cama usada.",
            urgent: false
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">

            {/* Header Hero */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-8 rounded-b-3xl shadow-xl mb-6 -mt-4 mx-[-16px] lg:mx-0 lg:rounded-3xl lg:mt-0 text-white text-center">
                <Heart className="mx-auto mb-3 text-white fill-white/20 animate-pulse" size={40} />
                <h2 className="text-2xl font-bold mb-1">Central de Doações</h2>
                <p className="text-rose-100 text-sm max-w-xs mx-auto">
                    Conectando corações generosos a quem mais precisa no nosso bairro.
                </p>
            </div>

            {/* Navegação por Abas */}
            <div className="flex p-1 bg-gray-100 rounded-xl mx-4 mb-6">
                <button
                    onClick={() => setActiveTab('campanhas')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'campanhas' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Campanhas
                </button>
                <button
                    onClick={() => setActiveTab('ongs')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'ongs' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    ONGs
                </button>
                <button
                    onClick={() => setActiveTab('mural')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'mural' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Mural
                </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="px-4 space-y-4">

                {/* ABA: CAMPANHAS */}
                {activeTab === 'campanhas' && campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${campaign.color}`}>
                                {campaign.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{campaign.title}</h3>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{campaign.org}</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>

                        {/* Barra de Progresso */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-rose-600">{campaign.progress}% Arrecadado</span>
                                <span className="text-gray-400">{campaign.target}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-rose-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${campaign.progress}%` }}></div>
                            </div>
                        </div>

                        <button className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${campaign.color}`}>
                            <Gift size={18} />
                            Quero Doar Agora
                        </button>
                    </div>
                ))}

                {/* ABA: ONGS */}
                {activeTab === 'ongs' && ngos.map((ngo) => (
                    <div key={ngo.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
                        <img src={ngo.image} alt={ngo.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1 inline-block">{ngo.cause}</span>
                            <h3 className="font-bold text-gray-800 leading-tight mb-1">{ngo.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{ngo.desc}</p>
                            <button className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1 w-fit">
                                <Building2 size={12} /> Ver Perfil
                            </button>
                        </div>
                    </div>
                ))}

                {/* ABA: MURAL DE PEDIDOS */}
                {activeTab === 'mural' && (
                    <>
                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-4 flex gap-3">
                            <AlertCircle className="text-yellow-600 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm">Ajuda entre Vizinhos</h4>
                                <p className="text-xs text-yellow-700 mt-1">Este espaço é para pedidos pontuais de moradores. Verifique a veracidade antes de ajudar.</p>
                            </div>
                        </div>

                        {requests.map((req) => (
                            <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                                {req.urgent && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">URGENTE</div>}
                                <h3 className="font-bold text-gray-800 mb-1">{req.title}</h3>
                                <p className="text-xs text-gray-400 font-medium mb-2">Para: {req.for}</p>
                                <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg italic">"{req.desc}"</p>
                                <button className="w-full border border-green-200 text-green-700 bg-green-50 py-2 rounded-xl font-bold text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle size={16} />
                                    Responder no Chat
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* CTA Final */}
            <div className="mt-8 text-center px-6">
                <button className="text-rose-600 font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto">
                    <PlusCircle size={16} />
                    Cadastrar minha ONG ou Pedido
                </button>
            </div>
        </div>
    );
}

// Ícone auxiliar para o botão final
import { PlusCircle } from 'lucide-react';
