import { useState, useEffect } from 'react';
import { Calendar, MapPin, Share2, Clock, User, Heart } from 'lucide-react';
import Modal from '../../components/Modal';
import { toggleFavorite, checkIsFavorite } from '../../services/favoritesService';
import NewsComments from './NewsComments';

export default function NewsDetailModal({ isOpen, onClose, news, currentUser }) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!currentUser?.id || !news?.id) return;
        checkIsFavorite(currentUser.id, news.id).then(setIsFavorite);
    }, [news?.id, currentUser?.id]);

    if (!news) return null;

    const handleToggleFavorite = async () => {
        if (!currentUser?.id) return;
        const next = await toggleFavorite(currentUser.id, news.id, 'news');
        setIsFavorite(next);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: news.title,
                text: news.summary,
                url: window.location.href,
            })
                .catch(() => {});
        } else {
            navigator.clipboard?.writeText(window.location.href);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Notícia Completa">
            <div className="space-y-6">
                {/* Imagem de Capa */}
                <div className="-mx-4 -mt-4 mb-4 relative h-64 bg-slate-100">
                    {news.image_url && (
                        <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute top-4 left-4">
                        <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
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
                            <span>{news.created_at ? new Date(news.created_at).toLocaleDateString('pt-BR') : ''}</span>
                        </div>
                        {news.location && (
                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                                <MapPin size={14} />
                                <span>{news.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{news.author_name || 'Redação Interlagos'}</span>
                        </div>
                    </div>
                </div>

                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                    <p className="font-medium text-lg text-gray-800 mb-4">{news.summary || news.content}</p>
                    {news.content && news.summary && news.content !== news.summary && (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{news.content}</p>
                    )}
                </div>

                <div className="border-t border-slate-100 mt-4 pt-4">
                    <NewsComments newsId={news.id} />
                </div>

                {/* Ações */}
                <div className="border-t border-gray-100 pt-6 flex gap-3">
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-3 rounded-xl transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex-1 bg-brand-50 text-brand-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-50 transition-colors"
                    >
                        <Share2 size={20} />
                        Compartilhar
                    </button>
                    {news.category === 'Eventos' && (
                        <button className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors shadow-card">
                            <Calendar size={20} />
                            Salvar na Agenda
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
