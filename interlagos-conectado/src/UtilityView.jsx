import React from 'react';
import { Phone, Shield, Ambulance, Flame, MapPin, Bus, Train, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

export default function UtilityView() {
    const panicButtons = [
        { name: 'Polícia', number: '190', icon: <Shield size={24} />, color: 'bg-blue-600 text-white shadow-blue-200' },
        { name: 'SAMU', number: '192', icon: <Ambulance size={24} />, color: 'bg-red-600 text-white shadow-red-200' },
        { name: 'Bombeiros', number: '193', icon: <Flame size={24} />, color: 'bg-orange-600 text-white shadow-orange-200' },
    ];

    const publicServices = [
        {
            name: 'Subprefeitura Capela do Socorro',
            desc: 'R. Cassiano dos Santos, 499',
            status: 'Aberto agora',
            icon: <MapPin className="text-indigo-600" />
        },
        {
            name: 'UPA Interlagos',
            desc: 'R. Sargento Geraldo Sant\'Ana, 900',
            status: '24 Horas',
            icon: <Ambulance className="text-red-500" />
        },
        {
            name: 'Descomplica SP',
            desc: 'Serviços digitais e presenciais',
            status: '08:00 - 17:00',
            icon: <Clock className="text-green-600" />
        },
    ];

    const transportLinks = [
        { name: 'Estação Autódromo (Linha 9)', icon: <Train size={20} />, color: 'text-emerald-600 bg-emerald-50' },
        { name: 'Terminal Interlagos', icon: <Bus size={20} />, color: 'text-blue-600 bg-blue-50' },
        { name: 'Estação Jurubatuba', icon: <Train size={20} />, color: 'text-emerald-600 bg-emerald-50' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20 p-4">

            {/* Header de Emergência */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="text-red-600" size={20} />
                    <h2 className="font-bold text-red-900">Emergência 24h</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {panicButtons.map((btn) => (
                        <a
                            key={btn.name}
                            href={`tel:${btn.number}`}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl shadow-lg active:scale-95 transition-all ${btn.color}`}
                        >
                            <div className="mb-1">{btn.icon}</div>
                            <span className="font-bold text-sm">{btn.name}</span>
                            <span className="text-xs opacity-80">{btn.number}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Serviços Públicos */}
            <div className="mb-6">
                <h2 className="font-bold text-gray-800 text-lg mb-3 px-1">Serviços Essenciais</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    {publicServices.map((service, idx) => (
                        <div key={idx} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                {service.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 text-sm">{service.name}</h3>
                                <p className="text-xs text-gray-500 mb-1">{service.desc}</p>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    {service.status}
                                </span>
                            </div>
                            <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transporte */}
            <div>
                <h2 className="font-bold text-gray-800 text-lg mb-3 px-1">Transporte & Mobilidade</h2>
                <div className="grid grid-cols-1 gap-3">
                    {transportLinks.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                            <div className={`p-2 rounded-lg ${item.color}`}>
                                {item.icon}
                            </div>
                            <span className="font-medium text-gray-700 text-sm flex-1">{item.name}</span>
                            <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                                Ver Horários
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banner Sabesp/Enel */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <a href="tel:08000119911" className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center hover:bg-blue-100 transition-colors">
                    <p className="text-blue-800 font-bold text-sm">Sabesp</p>
                    <p className="text-blue-600 text-xs">0800 011 9911</p>
                </a>
                <a href="tel:08007272120" className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center hover:bg-purple-100 transition-colors">
                    <p className="text-purple-800 font-bold text-sm">Enel</p>
                    <p className="text-purple-600 text-xs">0800 727 2120</p>
                </a>
            </div>
        </div>
    );
}
