import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { createCampaign } from '../../services/communityService';
import { useToast } from '../../components/Toast';

export default function CreateCampaignForm({ 
    categories, 
    currentUser, 
    onClose 
}) {
    const [newItemType, setNewItemType] = useState('donation');
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const f = e.target;
        try {
            await createCampaign({
                title: f.title.value,
                description: f.description.value,
                whatsapp: f.whatsapp.value,
                type: newItemType,
                author_id: currentUser.uid,
                author_name: currentUser.displayName,
                status: 'pending',
            });
            showToast('Sua ação foi enviada para análise da moderação!', 'success');
            onClose();
        } catch (err) {
            console.error(err);
            showToast('Erro ao enviar.', 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nova Ação Solidária</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {categories.filter(c => c.id !== 'all').map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setNewItemType(cat.id)}
                            className={`flex-1 min-w-[100px] flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${newItemType === cat.id
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                }`}
                        >
                            {cat.icon && <cat.icon size={24} className={newItemType === cat.id ? 'text-indigo-600' : 'text-slate-400'} />}
                            <span className="text-xs font-bold">{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6 flex gap-3">
                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-xs text-amber-700 leading-relaxed">
                        <strong>Segurança:</strong> Nunca compartilhe dados bancários ou endereços residenciais publicamente. Combine entregas em locais públicos e seguros.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Título</label>
                        <input name="title" placeholder={newItemType === 'request' ? "Do que você precisa?" : "O que você vai doar/oferecer?"} className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" required />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Descrição Detalhada</label>
                        <textarea name="description" placeholder="Descreva os itens, estado de conservação ou detalhes do pedido..." className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" rows="4" required />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">WhatsApp para Contato</label>
                        <input name="whatsapp" placeholder="(11) 99999-9999" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" required />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all mt-2">
                        Enviar para Análise
                    </button>
                </form>
            </div>
        </div>
    );
}
