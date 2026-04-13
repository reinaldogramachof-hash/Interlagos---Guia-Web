import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, Tag, User, AlertTriangle, ShieldCheck, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Modal from '../../components/Modal';
import { toggleFavorite, checkIsFavorite } from '../../services/favoritesService';

export default function AdDetailModal({ isOpen, onClose, ad, currentUser }) {
    const [currentImg, setCurrentImg] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    
    useEffect(() => { setCurrentImg(0); }, [ad]);
    useEffect(() => {
        if (!currentUser?.id || !ad?.id) return;
        checkIsFavorite(currentUser.id, ad.id).then(setIsFavorite);
    }, [ad?.id, currentUser?.id]);

    if (!ad) return null;

    const handleToggleFavorite = async () => {
        if (!currentUser?.id) return;
        const next = await toggleFavorite(currentUser.id, ad.id, 'ad');
        setIsFavorite(next);
    };

    const handleWhatsApp = () => {
        if (ad.whatsapp) {
            const number = ad.whatsapp.replace(/\D/g, '');
            window.open(`https://wa.me/55${number}?text=Olá, vi seu anúncio "${ad.title}" no App Interlagos!`, '_blank');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Anúncio" action={
            <button onClick={handleToggleFavorite} className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
        }>
            <div className="space-y-6">
                {/* Imagem Principal */}
                <div className="-mx-4 -mt-4 mb-4 bg-black relative h-64 flex flex-col justify-end group">
                    {(() => {
                        const allImages = [ad.image_url, ...(ad.gallery_urls || [])].filter(Boolean);
                        if (allImages.length === 0) {
                            return (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                                    <Tag size={48} className="mb-2 opacity-50" />
                                    <span className="text-sm">Sem imagem</span>
                                </div>
                            );
                        }
                        return (
                            <>
                                <img
                                    key={currentImg}
                                    src={allImages[currentImg]}
                                    alt={ad.title}
                                    className="absolute inset-0 w-full h-full object-contain bg-black animate-in fade-in duration-300"
                                />
                                
                                {allImages.length > 1 && (
                                    <>
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full pointer-events-none z-20">
                                            {currentImg + 1} / {allImages.length}
                                        </div>
                                        
                                        <button 
                                            onClick={() => setCurrentImg(i => Math.max(0, i - 1))}
                                            disabled={currentImg === 0}
                                            className="absolute left-0 top-0 bottom-0 min-w-[44px] flex items-center justify-center bg-gradient-to-r from-black/20 to-transparent disabled:opacity-0 transition-opacity z-20"
                                        >
                                            <div className="bg-black/50 text-white rounded-full p-1"><ChevronLeft size={20}/></div>
                                        </button>
                                        
                                        <button 
                                            onClick={() => setCurrentImg(i => Math.min(allImages.length - 1, i + 1))}
                                            disabled={currentImg === allImages.length - 1}
                                            className="absolute right-0 top-0 bottom-0 min-w-[44px] flex items-center justify-center bg-gradient-to-l from-black/20 to-transparent disabled:opacity-0 transition-opacity z-20"
                                        >
                                            <div className="bg-black/50 text-white rounded-full p-1"><ChevronRight size={20}/></div>
                                        </button>

                                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                                            {allImages.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImg(i)}
                                                    className={`w-2 h-2 rounded-full transition-colors ${currentImg === i ? 'bg-indigo-600' : 'bg-white/50 backdrop-blur'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        );
                    })()}
                    <div className="absolute top-4 left-4 pointer-events-none z-20">
                        <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
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
