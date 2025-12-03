import React from 'react';
import { Calendar, MapPin, Share2, Clock, User } from 'lucide-react';
import Modal from './Modal';

export default function NewsDetailModal({ isOpen, onClose, news }) {
    if (!news) return null;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: news.title,
                text: news.summary,
                url: window.location.href,
            })
                .catch((error) => console.log('Error sharing', error));
        } else {
            alert('Compartilhamento não suportado neste navegador.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Notícia Completa">
            <div className="space-y-6">
                {/* Imagem de Capa */}
                <div className="-mx-4 -mt-4 mb-4 relative h-64">
                    <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                            {news.category}
                        </span>
                    </div>
                </div>

                {/* Cabeçalho */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">{news.title}</h2>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{news.date}</span>
                        </div>
                        {news.location && (
                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                                <MapPin size={14} />
                                <span>{news.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>Redação Interlagos</span>
                        </div>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                    <p className="font-medium text-lg text-gray-800 mb-4">
                        {news.summary}
                    </p>
                    <p>
                        {/* Simulação de conteúdo longo - em um app real viria do backend */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>

                {/* Ações */}
                <div className="border-t border-gray-100 pt-6 flex gap-3">
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-blue-50 text-blue-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                    >
                        <Share2 size={20} />
                        Compartilhar
                    </button>
                    {news.category === 'Eventos' && (
                        <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            <Calendar size={20} />
                            Salvar na Agenda
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
