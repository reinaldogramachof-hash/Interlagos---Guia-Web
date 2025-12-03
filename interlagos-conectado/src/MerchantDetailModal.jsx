import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Star, Share2, Globe, Instagram, Facebook } from 'lucide-react';
import Modal from './Modal';

export default function MerchantDetailModal({ isOpen, onClose, merchant }) {
    if (!merchant) return null;

    // Mock de imagens adicionais se não houver
    const gallery = merchant.gallery || [
        merchant.image || 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1472851294608-415522f96319?auto=format&fit=crop&q=80&w=500'
    ];

    const handleWhatsApp = () => {
        if (merchant.whatsapp) {
            const number = merchant.whatsapp.replace(/\D/g, '');
            window.open(`https://wa.me/55${number}?text=Olá, vi sua empresa no App Interlagos!`, '_blank');
        }
    };

    const handleCall = () => {
        if (merchant.phone || merchant.whatsapp) {
            window.location.href = `tel:${merchant.phone || merchant.whatsapp}`;
        }
    };

    const handleMap = () => {
        if (merchant.address) {
            const query = encodeURIComponent(`${merchant.address}, Interlagos, São Paulo`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={merchant.name}>
            <div className="space-y-6">
                {/* Capa e Galeria */}
                <div className="-mx-4 -mt-4 mb-4">
                    <div className="h-56 bg-gray-200 relative">
                        <img
                            src={gallery[0]}
                            alt={merchant.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                                    {merchant.category}
                                </span>
                                {merchant.rating && (
                                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                                        <Star size={12} fill="currentColor" />
                                        {merchant.rating}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Mini Galeria */}
                    <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                        {gallery.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Galeria ${idx}`}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                            />
                        ))}
                    </div>
                </div>

                {/* Informações Principais */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{merchant.name}</h2>
                    <p className="text-gray-600 leading-relaxed">{merchant.description}</p>
                </div>

                {/* Informações de Contato e Endereço */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                    {merchant.address && (
                        <div className="flex items-start gap-3 text-sm text-gray-700">
                            <MapPin className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                            <span>{merchant.address}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Clock className="text-indigo-600 shrink-0" size={18} />
                        <span>Aberto agora • Fecha às 18:00</span>
                    </div>
                </div>

                {/* Comodidades (Tags) */}
                <div className="flex flex-wrap gap-2">
                    {['Wi-Fi Grátis', 'Estacionamento', 'Pet Friendly', 'Acessível'].map((tag, i) => (
                        <span key={i} className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Botões de Ação Fixos */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={handleWhatsApp}
                        className="col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                    >
                        <MessageCircle size={20} />
                        Chamar no WhatsApp
                    </button>
                    <button
                        onClick={handleCall}
                        className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <Phone size={20} />
                        Ligar
                    </button>
                    <button
                        onClick={handleMap}
                        className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <MapPin size={20} />
                        Como Chegar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
