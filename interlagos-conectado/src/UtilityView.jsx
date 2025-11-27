import React from 'react';
import { Phone, Shield, Ambulance, Flame, MapPin } from 'lucide-react';

export default function UtilityView() {
    const utilities = [
        {
            category: 'Emergência',
            items: [
                { name: 'Polícia Militar', number: '190', icon: <Shield className="text-blue-600" /> },
                { name: 'SAMU', number: '192', icon: <Ambulance className="text-red-600" /> },
                { name: 'Bombeiros', number: '193', icon: <Flame className="text-orange-600" /> },
            ]
        },
        {
            category: 'Saúde',
            items: [
                { name: 'UPA Interlagos', number: '(11) 5666-0000', icon: <Ambulance className="text-green-600" /> },
                { name: 'Hospital Grajaú', number: '(11) 5662-0000', icon: <Ambulance className="text-green-600" /> },
            ]
        },
        {
            category: 'Serviços Públicos',
            items: [
                { name: 'Subprefeitura Capela do Socorro', number: '156', icon: <MapPin className="text-gray-600" /> },
                { name: 'Sabesp', number: '0800 011 9911', icon: <Phone className="text-blue-400" /> },
                { name: 'Enel', number: '0800 727 2120', icon: <Phone className="text-purple-600" /> },
            ]
        }
    ];

    return (
        <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-indigo-50 p-6 rounded-2xl text-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-900">Utilidade Pública</h2>
                <p className="text-indigo-600">Telefones e endereços importantes do bairro.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {utilities.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                            <h3 className="font-bold text-gray-700">{section.category}</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {section.items.map((item, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                            {item.icon}
                                        </div>
                                        <span className="font-medium text-gray-800">{item.name}</span>
                                    </div>
                                    <a
                                        href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                                        className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors"
                                    >
                                        {item.number}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
