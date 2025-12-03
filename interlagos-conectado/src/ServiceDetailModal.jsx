import React from 'react';
import { Phone, MapPin, Globe, Clock, ExternalLink } from 'lucide-react';
import Modal from './Modal';

export default function ServiceDetailModal({ isOpen, onClose, service }) {
    if (!service) return null;

    const handleCall = () => {
        if (service.phone) {
            window.open(`tel:${service.phone}`);
        }
    };

    const handleOpenMap = () => {
        if (service.address) {
            window.open(`https://maps.google.com/?q=${service.address}`, '_blank');
        }
    };

    const handleWebsite = () => {
        if (service.website) {
            window.open(service.website, '_blank');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={service.name}>
            <div className="space-y-6">
                {/* Cabeçalho com Ícone */}
                <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${service.colorBg || 'bg-blue-100'} ${service.colorText || 'text-blue-600'}`}>
                        {service.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center">{service.name}</h2>
                    <p className="text-gray-500 text-sm text-center mt-1">{service.category}</p>
                </div>

                {/* Informações de Contato */}
                <div className="space-y-4">
                    {service.phone && (
                        <div
                            onClick={handleCall}
                            className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Telefone</p>
                                <p className="text-lg font-bold text-gray-800">{service.phone}</p>
                            </div>
                        </div>
                    )}

                    {service.address && (
                        <div
                            onClick={handleOpenMap}
                            className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Endereço</p>
                                <p className="text-sm font-bold text-gray-800">{service.address}</p>
                            </div>
                        </div>
                    )}

                    {service.hours && (
                        <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Horário de Atendimento</p>
                                <p className="text-sm font-bold text-gray-800">{service.hours}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Descrição / Serviços */}
                {service.description && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm mb-2">Sobre o Serviço</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                )}

                {/* Ações */}
                <div className="border-t border-gray-100 pt-6 flex gap-3">
                    {service.website && (
                        <button
                            onClick={handleWebsite}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            <Globe size={20} />
                            Acessar Site
                        </button>
                    )}
                    {service.phone && (
                        <button
                            onClick={handleCall}
                            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                        >
                            <Phone size={20} />
                            Ligar Agora
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
