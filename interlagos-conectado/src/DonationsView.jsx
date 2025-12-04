import React, { useState, useEffect } from 'react';
import { Heart, HandHeart, Gift, ChevronRight, MessageCircle, PlusCircle, Filter, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import CampaignDetailModal from './CampaignDetailModal';

const categories = ['Campanhas', 'ONGs', 'Voluntariado', 'Alimentos', 'Roupas', 'Móveis'];

// Mock Data for Fallback
const mockCampaigns = [
    {
        id: 1,
        title: 'Inverno Solidário 2024',
        organization: 'Associação de Moradores',
        category: 'Campanhas',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=500',
        description: 'Arrecadação de cobertores e agasalhos para famílias carentes da região.',
        progress: 75,
        goal: '500 cobertores',
        collected: '375',
        daysLeft: 12
    },
    {
        id: 2,
        title: 'Reforma da Creche Comunitária',
        organization: 'ONG Criança Feliz',
        category: 'Campanhas',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=500',
        description: 'Ajude-nos a reformar o telhado da creche que atende 50 crianças do bairro.',
        progress: 40,
        goal: 'R$ 15.000',
        collected: 'R$ 6.000',
        daysLeft: 25
    }
];

const mockNGOs = [
    {
        id: 1,
        name: 'ONG Criança Feliz',
        category: 'ONGs',
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=500',
        description: 'Atuamos há 10 anos oferecendo reforço escolar e atividades culturais.',
        address: 'Rua das Flores, 123',
        phone: '(11) 99999-9999',
        cause: 'Educação'
    },
    {
        id: 2,
        name: 'Abrigo Patinhas',
        category: 'ONGs',
        image: 'https://images.unsplash.com/photo-1551290464-64c78d953333?auto=format&fit=crop&q=80&w=500',
        description: 'Resgate e reabilitação de animais de rua. Adote um amigo!',
        address: 'Av. Principal, 500',
        phone: '(11) 98888-8888',
        cause: 'Animais'
    }
];

const mockVolunteering = [
    {
        id: 1,
        title: 'Professor de Artes',
        organization: 'Centro Cultural',
        category: 'Voluntariado',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=500',
        description: 'Buscamos voluntários para dar oficinas de pintura para idosos.',
        schedule: 'Sábados, 14h às 16h',
        requirements: 'Paciência e amor pela arte.'
    }
];

export default function DonationsView({ user }) {
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Campanhas');
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carregar campanhas reais
    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (fetched.length === 0) {
                setCampaigns(mockCampaigns); // Fallback to mock data if empty
            } else {
                setCampaigns(fetched);
            }
            setLoading(false);
        }, (error) => {
            console.error("Erro ao carregar campanhas:", error);
            setCampaigns(mockCampaigns); // Fallback on error
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 -mb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Filter size={16} />
                        {cat}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="px-4 lg:px-0 mt-6">
                {selectedCategory === 'Campanhas' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? <p className="text-center text-slate-400 col-span-2">Carregando campanhas...</p> :
                            campaigns.map((campaign) => (
                                <div
                                    key={campaign.id}
                                    onClick={() => setSelectedCampaign(campaign)}
                                    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
                                        <img src={campaign.image || 'https://via.placeholder.com/500x200?text=Campanha'} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                            Em andamento
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{campaign.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Org: {campaign.organization || campaign.organizer}</p>

                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                                                <span>{campaign.progress || 0}% alcançado</span>
                                                <span>Meta: {campaign.goal}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.min(campaign.progress || 0, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <button className="w-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 py-3 rounded-xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                                            Quero Ajudar
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {selectedCategory === 'ONGs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockNGOs.map((ngo) => (
                            <div key={ngo.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-4">
                                <img src={ngo.image} alt={ngo.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{ngo.name}</h3>
                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">{ngo.cause}</span>
                                </div>
                                <ChevronRight className="text-slate-300 dark:text-slate-600" size={20} />
                            </div>
                        ))}
                    </div>
                )}

                {selectedCategory === 'Voluntariado' && (
                    <div className="space-y-4">
                        {mockVolunteering.map((job) => (
                            <div key={job.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{job.title}</h3>
                                        <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{job.organization}</span>
                                    </div>
                                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                                        Aberto
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{job.description}</p>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-indigo-500" />
                                        {job.schedule}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HandHeart size={14} className="text-indigo-500" />
                                        {job.requirements}
                                    </div>
                                </div>
                                <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors">
                                    Quero ser voluntário
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
                    className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                    <PlusCircle size={16} />
                    Cadastrar minha ONG ou Pedido
                </button>
            </div>

            <CampaignDetailModal isOpen={!!selectedCampaign} onClose={() => setSelectedCampaign(null)} campaign={selectedCampaign} />
        </div>
    );
}
