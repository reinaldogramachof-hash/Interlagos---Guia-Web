import React, { useState } from 'react';
import { Megaphone, Tag, Briefcase, Home, Wrench, MessageCircle, PlusCircle, Search } from 'lucide-react';

export default function AdsView() {
    const [activeCategory, setActiveCategory] = useState('Todos');

    const categories = [
        { id: 'Todos', label: 'Todos', icon: <Tag size={16} /> },
        { id: 'Vendas', label: 'Vendas & Desapegos', icon: <Tag size={16} /> },
        { id: 'Empregos', label: 'Vagas de Emprego', icon: <Briefcase size={16} /> },
        { id: 'Imóveis', label: 'Imóveis', icon: <Home size={16} /> },
        { id: 'Serviços', label: 'Serviços Autônomos', icon: <Wrench size={16} /> },
    ];

    const ads = [
        {
            id: 1,
            category: 'Vendas',
            title: 'Sofá Retrátil 3 Lugares',
            price: 'R$ 800',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=300',
            description: 'Sofá em ótimo estado, cor cinza, sem rasgos. Retirar no Jd. Satélite.',
            whatsapp: '11999999999',
            time: 'Há 2 horas'
        },
        {
            id: 2,
            category: 'Empregos',
            title: 'Balconista de Padaria',
            price: 'Salário a combinar',
            image: null,
            description: 'Padaria Estrela contrata com experiência. Turno da manhã.',
            whatsapp: '11999999999',
            time: 'Há 5 horas'
        },
        {
            id: 3,
            category: 'Serviços',
            title: 'Eletricista Residencial',
            price: 'Orçamento Grátis',
            image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300',
            description: 'Instalações, reparos e manutenção. Atendo todo o bairro.',
            whatsapp: '11999999999',
            time: 'Ontem'
        },
        {
            id: 4,
            category: 'Imóveis',
            title: 'Kitnet Mobiliada',
            price: 'R$ 1.200/mês',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=300',
            description: 'Próximo ao autódromo. Água e luz inclusos.',
            whatsapp: '11999999999',
            time: 'Hoje'
        },
        {
            id: 5,
            category: 'Vendas',
            title: 'iPhone 11 64GB',
            price: 'R$ 1.500',
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=300',
            description: 'Bateria 85%, sem marcas de uso. Acompanha carregador.',
            whatsapp: '11999999999',
            time: 'Há 30 min'
        },
        {
            id: 6,
            category: 'Vendas',
            title: 'Bicicleta Aro 29',
            price: 'R$ 900',
            image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=300',
            description: 'Bike seminova, freio a disco, 21 marchas. Ótima para trilha.',
            whatsapp: '11999999999',
            time: 'Há 1 dia'
        },
        {
            id: 7,
            category: 'Serviços',
            title: 'Manicure e Pedicure',
            price: 'R$ 45,00',
            image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=300',
            description: 'Atendo a domicílio na região de Interlagos. Material esterilizado.',
            whatsapp: '11999999999',
            time: 'Há 3 horas'
        },
        {
            id: 8,
            category: 'Empregos',
            title: 'Ajudante Geral',
            price: 'R$ 1.600',
            image: null,
            description: 'Vaga para loja de material de construção. Carga e descarga.',
            whatsapp: '11999999999',
            time: 'Há 4 horas'
        },
        {
            id: 9,
            category: 'Imóveis',
            title: 'Casa 2 Quartos',
            price: 'R$ 280.000',
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=300',
            description: 'Venda. Garagem para 2 carros, quintal grande. Aceita financiamento.',
            whatsapp: '11999999999',
            time: 'Há 2 dias'
        },
        {
            id: 10,
            category: 'Vendas',
            title: 'Geladeira Brastemp',
            price: 'R$ 1.100',
            image: 'https://images.unsplash.com/photo-1571175443880-49e1d58b794a?auto=format&fit=crop&q=80&w=300',
            description: 'Frost Free, inox, funcionando perfeitamente. Motivo: mudança.',
            whatsapp: '11999999999',
            time: 'Há 6 horas'
        }
    ];

    const filteredAds = activeCategory === 'Todos'
        ? ads
        : ads.filter(ad => ad.category === activeCategory || (activeCategory === 'Empregos' && ad.category === 'Empregos') || (activeCategory === 'Serviços' && ad.category === 'Serviços') || (activeCategory === 'Imóveis' && ad.category === 'Imóveis'));

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* Header Promocional */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-b-3xl shadow-lg mb-6 -mt-4 mx-[-16px] lg:mx-0 lg:rounded-3xl lg:mt-0">
                <div className="flex items-center justify-between text-white mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Classificados</h2>
                        <p className="text-violet-100 text-sm">O mercado livre do seu bairro.</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <Megaphone size={24} className="text-yellow-300" />
                    </div>
                </div>

                {/* Barra de Busca Rápida */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar desapegos, vagas..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-gray-800 border-none outline-none bg-white/95 shadow-inner focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Categorias (Scroll Horizontal) */}
            <div className="flex gap-2 overflow-x-auto pb-4 px-4 -mx-4 scrollbar-hide mb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border
                            ${activeCategory === cat.id
                                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Lista de Anúncios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-0">
                {filteredAds.map((ad) => (
                    <div key={ad.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                            {ad.image ? (
                                <img
                                    src={ad.image}
                                    alt={ad.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-violet-50 text-violet-300">
                                    <Briefcase size={48} />
                                </div>
                            )}
                            <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider">
                                {ad.category}
                            </span>
                            <span className="absolute bottom-3 right-3 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                {ad.time}
                            </span>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1">{ad.title}</h3>
                            </div>
                            <p className="text-violet-600 font-bold text-lg mb-2">{ad.price}</p>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{ad.description}</p>

                            <button className="w-full bg-green-50 text-green-700 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-colors">
                                <MessageCircle size={18} />
                                Chamar no Zap
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Action Button (FAB) - Anunciar */}
            <button className="fixed bottom-24 right-4 bg-violet-600 text-white p-4 rounded-full shadow-lg shadow-violet-600/30 hover:bg-violet-700 hover:scale-105 transition-all z-50 flex items-center gap-2 font-bold pr-6">
                <PlusCircle size={24} />
                Anunciar Grátis
            </button>
        </div>
    );
}
