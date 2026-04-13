import React from 'react';
import { MessageCircle, Calendar, User, Heart } from 'lucide-react';
import Modal from '../../components/Modal';

/**
 * Modal de detalhes de uma ação solidária/campanha.
 * @param {Object} props - isOpen, onClose, campaign, onWhatsApp
 */
export default function CampaignDetailModal({ isOpen, onClose, campaign, onWhatsApp }) {
    if (!campaign) return null;

    const typeMap = {
        donation: { label: 'Quero Doar',      cls: 'bg-emerald-50 text-emerald-600' },
        request:  { label: 'Preciso de Ajuda', cls: 'bg-amber-50 text-amber-600' },
        volunteer:{ label: 'Voluntariado',     cls: 'bg-blue-50 text-blue-600' },
        campaign: { label: 'Campanha Oficial', cls: 'bg-rose-50 text-rose-600' },
    };

    const type = typeMap[campaign.type] || typeMap.donation;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Ação">
            <div className="space-y-6">
                {/* 1. Imagem Principal */}
                <div className="-mx-4 -mt-4 bg-slate-100 relative h-48 flex items-center justify-center overflow-hidden">
                    {campaign.image_url ? (
                        <img 
                            src={campaign.image_url} 
                            alt={campaign.title} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="flex flex-col items-center text-slate-300">
                            <Heart size={48} className="opacity-50" />
                            <span className="text-[10px] mt-2 font-medium">Sem imagem</span>
                        </div>
                    )}
                </div>

                {/* 2. Badge e Cabeçalho */}
                <div className="space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${type.cls}`}>
                        {type.label}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {campaign.title}
                    </h2>
                </div>

                {/* 3. Descrição */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {campaign.description}
                    </p>
                </div>

                {/* 4. Infos Adicionais */}
                <div className="space-y-3">
                    {campaign.end_date && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={14} className="text-slate-400" />
                            <span>Encerra em {new Date(campaign.end_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}

                    {/* Autor */}
                    <div className="flex items-center gap-3 py-3 border-t border-slate-50 dark:border-white/5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {campaign.authorName?.charAt(0) || <User size={16} />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {campaign.authorName || 'Morador'}
                            </p>
                            <p className="text-[10px] text-slate-400">Autor da Ação</p>
                        </div>
                    </div>
                </div>

                {/* 5. Botão de Ação */}
                <button
                    onClick={onWhatsApp}
                    className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                >
                    <MessageCircle size={20} />
                    Entrar em Contato
                </button>
            </div>
        </Modal>
    );
}
