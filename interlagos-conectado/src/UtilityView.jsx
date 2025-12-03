import React, { useState } from 'react';
import { Phone, MapPin, Bus, Train, AlertTriangle, Stethoscope, Building2, Zap, Droplet, Wifi, Shield, Truck, ChevronRight } from 'lucide-react';
import ServiceDetailModal from './ServiceDetailModal';

export default function UtilityView() {
    const [selectedService, setSelectedService] = useState(null);

    const emergencyServices = [
        {
            id: 1,
            name: 'Polícia Militar',
            phone: '190',
            icon: <Shield size={24} />,
            colorBg: 'bg-blue-100',
            colorText: 'text-blue-700',
            category: 'Emergência',
            description: 'Atendimento para ocorrências policiais, crimes em andamento e situações de risco à vida.'
        },
        {
            id: 2,
            name: 'SAMU',
            phone: '192',
            icon: <Stethoscope size={24} />,
            colorBg: 'bg-red-100',
            colorText: 'text-red-700',
            category: 'Emergência',
            description: 'Serviço de Atendimento Móvel de Urgência. Para casos de urgência e emergência médica.'
        },
        {
            id: 3,
            name: 'Bombeiros',
            phone: '193',
            icon: <AlertTriangle size={24} />,
            colorBg: 'bg-orange-100',
            colorText: 'text-orange-700',
            category: 'Emergência',
            description: 'Atendimento para incêndios, resgates, acidentes com vítimas presas nas ferragens e vazamento de gás.'
        }
    ];

    const publicServices = [
        {
            id: 4,
            name: 'Subprefeitura Capela do Socorro',
            address: 'Rua Cassiano dos Santos, 499',
            phone: '(11) 3397-2700',
            hours: 'Seg-Sex, 8h-17h',
            icon: <Building2 size={24} />,
            colorBg: 'bg-gray-100',
            colorText: 'text-gray-700',
            category: 'Serviço Público',
            website: 'https://www.prefeitura.sp.gov.br/cidade/secretarias/regionais/capela_do_socorro/',
            description: 'Atendimento ao cidadão para solicitação de serviços de zeladoria, poda de árvores, tapa-buraco, entre outros.'
        },
        {
            id: 5,
            name: 'UPA Interlagos',
            address: 'Av. Atlântica, 2345',
            phone: '(11) 5666-1234',
            hours: '24 Horas',
            icon: <Stethoscope size={24} />,
            colorBg: 'bg-green-100',
            colorText: 'text-green-700',
            category: 'Saúde',
            description: 'Unidade de Pronto Atendimento para casos de urgência e emergência de média complexidade.'
        },
        {
            id: 6,
            name: 'Ecoponto Interlagos',
            address: 'Rua Jd. da Paz, 100',
            hours: 'Seg-Sáb, 8h-17h',
            icon: <Truck size={24} />,
            colorBg: 'bg-emerald-100',
            colorText: 'text-emerald-700',
            category: 'Serviço Público',
            description: 'Local para descarte correto de entulho, móveis velhos, restos de poda e recicláveis.'
        }
    ];

    const transportServices = [
        {
            id: 7,
            name: 'Estação Autódromo (CPTM)',
            address: 'Rua Plínio Schmidt, 307',
            icon: <Train size={24} />,
            colorBg: 'bg-emerald-100',
            colorText: 'text-emerald-700',
            category: 'Transporte',
            description: 'Estação da Linha 9-Esmeralda da CPTM. Acesso ao Autódromo de Interlagos.'
        },
        {
            id: 8,
            name: 'Terminal Grajaú',
            address: 'Av. Dona Belmira Marin, 500',
            icon: <Bus size={24} />,
            colorBg: 'bg-indigo-100',
            colorText: 'text-indigo-700',
            category: 'Transporte',
            description: 'Terminal de ônibus urbano com integração para diversas regiões da cidade e CPTM.'
        }
    ];

    const utilities = [
        { id: 9, name: 'Enel (Luz)', phone: '0800 7272 120', icon: <Zap size={20} />, colorBg: 'bg-yellow-100', colorText: 'text-yellow-700', category: 'Utilidade' },
        { id: 10, name: 'Sabesp (Água)', phone: '0800 011 9911', icon: <Droplet size={20} />, colorBg: 'bg-blue-100', colorText: 'text-blue-700', category: 'Utilidade' },
        { id: 11, name: 'Vivo / Claro / Tim', phone: '103 15', icon: <Wifi size={20} />, colorBg: 'bg-purple-100', colorText: 'text-purple-700', category: 'Utilidade' }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* Header */}
            <div className="bg-slate-800 p-6 rounded-b-3xl shadow-lg mb-6 -mt-4 mx-[-16px] lg:mx-0 lg:rounded-3xl lg:mt-0 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="text-yellow-400 fill-yellow-400" size={32} />
                    <h2 className="text-2xl font-bold">Utilidade Pública</h2>
                </div>
                <p className="text-slate-300 text-sm">Telefones e endereços essenciais para o seu dia a dia.</p>
            </div>

            <div className="px-4 space-y-8">
                {/* Emergência */}
                <section>
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Shield className="text-red-500" size={20} /> Emergência
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {emergencyServices.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${service.colorBg} ${service.colorText}`}>
                                    {service.icon}
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{service.name}</span>
                                <span className="text-xs text-red-600 font-bold">{service.phone}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Serviços Públicos */}
                <section>
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Building2 className="text-blue-600" size={20} /> Serviços Públicos
                    </h3>
                    <div className="space-y-3">
                        {publicServices.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${service.colorBg} ${service.colorText}`}>
                                    {service.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm">{service.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{service.address}</p>
                                </div>
                                <ChevronRight className="text-gray-300" size={20} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Transporte */}
                <section>
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Bus className="text-emerald-600" size={20} /> Transporte
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {transportServices.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${service.colorBg} ${service.colorText}`}>
                                    {service.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{service.name}</h4>
                                    <p className="text-xs text-gray-500">Ver detalhes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Concessionárias */}
                <section>
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Zap className="text-yellow-600" size={20} /> Concessionárias
                    </h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {utilities.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${service.colorBg} ${service.colorText}`}>
                                    {service.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm">{service.name}</h4>
                                    <p className="text-xs text-gray-500">{service.phone}</p>
                                </div>
                                <Phone className="text-green-500" size={20} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <ServiceDetailModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                service={selectedService}
            />
        </div>
    );
}
