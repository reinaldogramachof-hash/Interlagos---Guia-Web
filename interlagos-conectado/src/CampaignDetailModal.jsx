import React from 'react';
import { Heart, MapPin, Calendar, Share2, Copy, CheckCircle } from 'lucide-react';
import Modal from './Modal';

export default function CampaignDetailModal({ isOpen, onClose, campaign }) {
    if (!campaign) return null;

    const handleCopyPix = () => {
        if (campaign.pix) {
            navigator.clipboard.writeText(campaign.pix);
            alert('Chave PIX copiada!');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: campaign.title,
                text: `Ajude a campanha: ${campaign.title}`,
                url: window.location.href,
            })
                .catch((error) => console.log('Error sharing', error));
        } else {
            alert('Compartilhamento não suportado neste navegador.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Campanha">
            <div className="space-y-6">
                {/* Imagem de Capa */}
                <div className="-mx-4 -mt-4 mb-4 relative h-56">
                    <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                        <div className="flex items-center gap-2 text-white text-sm font-medium">
                            <Calendar size={14} />
                            <span>Válido até {campaign.endDate}</span>
                        </div>
                    </div>
                </div>

                {/* Título e Organização */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{campaign.title}</h2>
                    <div className="flex items-center gap-2 text-indigo-600 font-medium">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Heart size={14} />
                        </div>
                        <span>Organizado por {campaign.organizer}</span>
                    </div>
                </div>

                {/* Progresso */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                        <span>Arrecadado: {campaign.raised}</span>
                        <span className="text-gray-400">Meta: {campaign.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${campaign.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {campaign.progress}% da meta atingida! Continue ajudando.
                    </p>
                </div>

                {/* Descrição */}
                <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Sobre a Campanha</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {campaign.description}
                    </p>
                </div>

                {/* Pontos de Coleta */}
                {campaign.collectionPoints && (
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-3">Pontos de Coleta</h3>
                        <div className="space-y-2">
                            {campaign.collectionPoints.map((point, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg">
                                    <MapPin className="text-red-500 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{point.name}</p>
                                        <p className="text-xs text-gray-500">{point.address}</p>
                                        <p className="text-xs text-gray-400 mt-1">{point.hours}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Doação via PIX */}
                {campaign.pix && (
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                        <h3 className="font-bold text-indigo-900 mb-1">Doe qualquer valor via PIX</h3>
                        <p className="text-xs text-indigo-600 mb-3">Chave: {campaign.pix}</p>
                        <button
                            onClick={handleCopyPix}
                            className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold border border-indigo-200 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <Copy size={16} />
                            Copiar Chave PIX
                        </button>
                    </div>
                )}

                {/* Ações */}
                <div className="border-t border-gray-100 pt-6">
                    <button
                        onClick={handleShare}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200 text-lg"
                    >
                        <Share2 size={24} />
                        Compartilhar Campanha
                    </button>
                </div>
            </div>
        </Modal>
    );
}
