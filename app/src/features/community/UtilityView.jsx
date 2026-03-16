import React, { useState } from 'react';
import { Phone, Shield, Bus, Stethoscope, AlertTriangle, Search, Filter } from 'lucide-react';

const categories = ['Todos', 'Emergência', 'Saúde', 'Transportes', 'Segurança', 'Escolas', 'Cartórios', 'Correios'];

const mockServices = [
    {
        id: 1,
        name: 'SAMU',
        number: '192',
        category: 'Emergência',
        description: 'Serviço de Atendimento Móvel de Urgência.',
        icon: <AlertTriangle size={24} className="text-red-500" />
    },
    {
        id: 2,
        name: 'Polícia Militar',
        number: '190',
        category: 'Emergência',
        description: 'Emergências policiais e ocorrências.',
        icon: <Shield size={24} className="text-blue-500" />
    },
    {
        id: 3,
        name: 'UBS Jd. Satélite',
        number: '(11) 5666-0000',
        category: 'Saúde',
        description: 'Atendimento básico de saúde, vacinação e consultas.',
        icon: <Stethoscope size={24} className="text-green-500" />
    },
    {
        id: 4,
        name: 'Linha 607M-10',
        number: 'Terminal Grajaú',
        category: 'Transporte',
        description: 'Itinerário e horários de ônibus.',
        icon: <Bus size={24} className="text-yellow-500" />
    }
];

export default function UtilityView({ onServiceClick }) {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServices = mockServices.filter(service => {
        const matchesCategory = selectedCategory === 'Todos' || service.category === selectedCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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

            {/* Search Bar */}
            <div className="relative mb-6 mt-6">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar serviço útil..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                    <div
                        key={service.id}
                        onClick={() => onServiceClick(service)}
                        className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all group"
                    >
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            {service.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{service.name}</h3>
                            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-1">{service.number}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{service.description}</p>
                        </div>
                        <div className="self-center bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full text-indigo-600 dark:text-indigo-400">
                            <Phone size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {filteredServices.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                    Nenhum serviço encontrado.
                </div>
            )}
        </div>
    );
}
