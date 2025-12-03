import React, { useState } from 'react';
import { Heart, HandHeart, Gift, Users, ChevronRight, MessageCircle, PlusCircle, AlertCircle, Building2 } from 'lucide-react';
import CampaignDetailModal from './CampaignDetailModal';

export default function DonationsView() {
    const [activeTab, setActiveTab] = useState('campaigns');
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const campaigns = [
        {
            id: 1,
            title: 'Inverno Solidário 2024',
            organizer: 'Associação de Moradores',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=500',
            raised: '150 cobertores',
            goal: '500 cobertores',
            progress: 30,
            endDate: '30/06/2024',
            description: 'Neste inverno, ajude quem mais precisa. Estamos arrecadando cobertores e agasalhos em bom estado para distribuição nas comunidades carentes da região de Interlagos.',
            collectionPoints: [
                { name: 'Sede da Associação', address: 'Rua dos Moradores, 123', hours: 'Seg-Sex, 9h-18h' },
                { name: 'Mercado do Bairro', address: 'Av. Principal, 500', hours: 'Todos os dias, 8h-20h' }
            ],
            pix: 'associacao@interlagos.com.br'
        },
        {
            id: 2,
            title: 'Reforma da Creche Comunitária',
            organizer: 'ONG Criança Feliz',
            image: 'https://images.unsplash.com/photo-1502086223501-60051f87b847?auto=format&fit=crop&q=80&w=500',
            raised: 'R$ 5.000',
            goal: 'R$ 20.000',
            progress: 25,
            endDate: '15/07/2024',
            description: 'A Creche Comunitária precisa de reparos urgentes no telhado e pintura. Sua doação ajudará a manter um ambiente seguro e acolhedor para nossas crianças.',
            pix: 'ong@criancafeliz.org.br'
        },
        {
            id: 3,
            title: 'Cestas Básicas para Famílias',
            organizer: 'Paróquia São José',
            image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=500',
            raised: '80 cestas',
            goal: '200 cestas',
            progress: 40,
            endDate: 'Permanente',
            description: 'Arrecadação mensal de alimentos não perecíveis para montagem de cestas básicas destinadas às famílias cadastradas na assistência social da paróquia.',
            collectionPoints: [
                { name: 'Secretaria da Paróquia', address: 'Praça da Matriz, s/n', hours: 'Ter-Sáb, 8h-17h' }
            ]
        }
    ];

    const ngos = [
        {
            id: 1,
            name: 'ONG Criança Feliz',
            cause: 'Educação Infantil',
            description: 'Atendemos 150 crianças em situação de vulnerabilidade.',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200'
        },
        {
            id: 2,
            name: 'Proteção Animal Interlagos',
            cause: 'Causa Animal',
            description: 'Resgate e reabilitação de animais de rua.',
            image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200'
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
            title: "Roupas de Bebê",
            for: "Ana (Gestante)",
            desc: "Estou grávida de 8 meses e preciso de roupinhas para recém-nascido.",
            urgent: false
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* Header */}
            <div className="bg-pink-600 p-6 rounded-b-3xl shadow-lg mb-6 -mt-4 mx-[-16px] lg:mx-0 lg:rounded-3xl lg:mt-0 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Heart className="text-pink-200 fill-pink-200" size={32} />
                    <h2 className="text-2xl font-bold">Solidariedade</h2>
                </div>
                <p className="text-pink-100 text-sm">Conectando quem quer ajudar a quem precisa.</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6 mx-4">
                <button
                    onClick={() => setActiveTab('campaigns')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'campaigns' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Campanhas
                </button>
                <button
                    onClick={() => setActiveTab('ngos')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'ngos' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    ONGs Locais
                </button>
                <button
                    onClick={() => setActiveTab('mural')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'mural' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Mural
                </button>
            </div>

            {/* Content */}
            <div className="px-4 lg:px-0">
                {activeTab === 'campaigns' && (
                    <div className="space-y-6">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                onClick={() => setSelectedCampaign(campaign)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="relative h-48">
                                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                        Em andamento
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{campaign.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4">Org: {campaign.organizer}</p>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                            <span>{campaign.raised}</span>
                                            <span>Meta: {campaign.goal}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${campaign.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-pink-50 text-pink-600 py-3 rounded-xl font-bold text-sm hover:bg-pink-100 transition-colors">
                                        Quero Ajudar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'ngos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ngos.map((ngo) => (
                            <div key={ngo.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <img src={ngo.image} alt={ngo.name} className="w-16 h-16 rounded-full object-cover border-2 border-pink-100" />
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">{ngo.name}</h3>
                                    <span className="text-xs text-pink-600 font-medium bg-pink-50 px-2 py-0.5 rounded-full">{ngo.cause}</span>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ngo.description}</p>
                                </div>
                                <ChevronRight className="text-gray-300 ml-auto" size={20} />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'mural' && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-yellow-100 p-2 rounded-full text-yellow-700">
                                    <HandHeart size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-900 text-sm">Preciso de Cadeira de Rodas</h3>
                                    <p className="text-xs text-yellow-800 mt-1">"Minha mãe sofreu um acidente e precisa de uma cadeira de rodas emprestada por 2 meses."</p>
                                    <p className="text-[10px] text-yellow-600 mt-2 font-bold">- Maria S., Jd. Satélite</p>
                                    <button className="mt-3 text-xs bg-yellow-600 text-white px-3 py-1.5 rounded-lg font-bold">Entrar em Contato</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                                    <Gift size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm">Doação de Roupas de Bebê</h3>
                                    <p className="text-xs text-blue-800 mt-1">"Tenho muitas roupinhas de recém-nascido (menino) para doar. Retirar no local."</p>
                                    <p className="text-[10px] text-blue-600 mt-2 font-bold">- João P., Veleiros</p>
                                    <button className="mt-3 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold">Quero Buscar</button>
                                </div>
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
                    </div>
                )}
            </div>

            {/* CTA Final */}
            <div className="mt-8 text-center px-6">
                <button className="text-rose-600 font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto">
                    <PlusCircle size={16} />
                    Cadastrar minha ONG ou Pedido
                </button>
            </div>

            <CampaignDetailModal
                isOpen={!!selectedCampaign}
                onClose={() => setSelectedCampaign(null)}
                campaign={selectedCampaign}
            />
        </div>
    );
}
