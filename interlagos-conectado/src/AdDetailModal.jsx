import React from 'react';
import { MessageCircle, Clock, Tag, User, MapPin, Share2, AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function AdDetailModal({ isOpen, onClose, ad }) {
    if (!ad) return null;

    const handleWhatsApp = () => {
        if (ad.whatsapp) {
            const number = ad.whatsapp.replace(/\D/g, '');
            window.open(`https://wa.me/55${number}?text=Olá, vi seu anúncio "${ad.title}" no App Interlagos!`, '_blank');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Anúncio">
            <div className="space-y-6">
                {/* Imagem Principal */}
                <div className="-mx-4 -mt-4 mb-4 bg-gray-100 relative h-64 flex items-center justify-center overflow-hidden">
                    {ad.image ? (
                        <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <Tag size={48} className="mb-2 opacity-50" />
                            <span className="text-sm">Sem imagem</span>
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                            {ad.category}
                        </span>
                    </div>
                </div>

                {/* Cabeçalho */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{ad.title}</h2>
                    <p className="text-3xl font-bold text-indigo-600 mb-1">{ad.price}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>Publicado {ad.time}</span>
                    </div>
                </div>

                {/* Descrição */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm mb-2">Descrição</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {ad.description}
                    </p>
                </div>

                {/* Vendedor */}
                <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">Anunciante do Bairro</p>
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <ShieldCheck size={12} />
                            Identidade Verificada
                        </div>
                    </div>
                </div>

                {/* Dicas de Segurança */}
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3">
                    <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                    <div className="text-xs text-yellow-800">
                        <p className="font-bold mb-1">Dica de Segurança:</p>
                        <p>Nunca faça pagamentos antecipados. Prefira encontrar em locais públicos e movimentados.</p>
                    </div>
                </div>

                {/* Botão de Ação */}
                <button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200 text-lg"
                >
                    <MessageCircle size={24} />
                    Tenho Interesse
                </button>
            </div>
        </Modal>
    );
}

// Icon helper
import { ShieldCheck } from 'lucide-react';
