import React, { useState, useEffect } from 'react';
import { Heart, HandHeart, Gift, ChevronRight, MessageCircle, PlusCircle } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import CampaignDetailModal from './CampaignDetailModal';

export default function DonationsView({ user }) {
    const [activeTab, setActiveTab] = useState('campaigns');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carregar campanhas reais
    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCampaigns(fetched);
            setLoading(false);
        }, (error) => {
            console.error("Erro ao carregar campanhas:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Mock para outras abas (por enquanto)
    const ngos = [
        { id: 1, name: 'ONG Criança Feliz', cause: 'Educação', description: 'Atendemos 150 crianças.', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200' },
    ];
    const requests = [
        { id: 1, title: "Cadeira de Rodas", for: "Dona Maria", desc: "Preciso emprestada por 2 meses.", urgent: true },
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
                <button onClick={() => setActiveTab('campaigns')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'campaigns' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>Campanhas</button>
                <button onClick={() => setActiveTab('ngos')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'ngos' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>ONGs</button>
                <button onClick={() => setActiveTab('mural')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'mural' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>Mural</button>
            </div>

            {/* Content */}
            <div className="px-4 lg:px-0">
                {activeTab === 'campaigns' && (
                    <div className="space-y-6">
                        {loading ? <p className="text-center text-gray-400">Carregando campanhas...</p> :
                            campaigns.length === 0 ? <p className="text-center text-gray-400">Nenhuma campanha ativa no momento.</p> :
                                campaigns.map((campaign) => (
                                    <div
                                        key={campaign.id}
                                        onClick={() => setSelectedCampaign(campaign)}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="relative h-48 bg-gray-200">
                                            <img src={campaign.image || 'https://via.placeholder.com/500x200?text=Campanha'} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                                Em andamento
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-gray-900 text-lg mb-1">{campaign.title}</h3>
                                            <p className="text-xs text-gray-500 mb-4">Org: {campaign.organizer}</p>

                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                                    <span>{campaign.raised || '0'}</span>
                                                    <span>Meta: {campaign.goal}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                                        style={{ width: `${Math.min(campaign.progress || 0, 100)}%` }}
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
                                </div>
                                <ChevronRight className="text-gray-300 ml-auto" size={20} />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'mural' && (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                                {req.urgent && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">URGENTE</div>}
                                <h3 className="font-bold text-gray-800 mb-1">{req.title}</h3>
                                <p className="text-xs text-gray-400 font-medium mb-2">Para: {req.for}</p>
                                <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg italic">"{req.desc}"</p>
                                <button className="w-full border border-green-200 text-green-700 bg-green-50 py-2 rounded-xl font-bold text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle size={16} />
                                    Responder
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 text-center px-6">
                <button
                    onClick={() => {
                        if (!user) alert("Faça login para cadastrar.");
                        else alert("Funcionalidade em desenvolvimento! Entre em contato pelo WhatsApp.");
                    }}
                    className="text-rose-600 font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                    <PlusCircle size={16} />
                    Cadastrar minha ONG ou Pedido
                </button>
            </div>

            <CampaignDetailModal isOpen={!!selectedCampaign} onClose={() => setSelectedCampaign(null)} campaign={selectedCampaign} />
        </div>
    );
}
