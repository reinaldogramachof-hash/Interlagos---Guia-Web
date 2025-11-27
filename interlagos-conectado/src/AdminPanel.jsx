import React, { useState } from 'react';
import {
    X, Search, Edit, Trash2, Save, Plus,
    Star, Trophy, Store, Tag, Check, Bell
} from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function AdminPanel({ merchants, categories, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const initialFormState = {
        name: '', category: 'Alimentação', description: '',
        phone: '', whatsapp: '', address: '',
        plan: 'basic', promotion: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    // Filter merchants for the list
    const filteredMerchants = merchants.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (merchant) => {
        setEditingId(merchant.id);
        setIsCreating(false);
        setFormData({
            name: merchant.name,
            category: merchant.category,
            description: merchant.description || '',
            phone: merchant.phone || '',
            whatsapp: merchant.whatsapp || '',
            address: merchant.address || '',
            plan: merchant.plan || (merchant.isPremium ? 'premium' : 'basic'),
            promotion: merchant.promotion || ''
        });
    };

    const handleCreate = () => {
        setEditingId(null);
        setIsCreating(true);
        setFormData(initialFormState);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const dataToSave = {
                ...formData,
                isPremium: formData.plan === 'premium' || formData.plan === 'super', // Legacy compatibility
                updatedAt: serverTimestamp()
            };

            if (isCreating) {
                await addDoc(collection(db, 'merchants'), {
                    ...dataToSave,
                    createdAt: serverTimestamp(),
                    views: 0,
                    rating: formData.plan === 'super' ? 5.0 : 0 // Default rating for super
                });
                alert('Comércio criado com sucesso!');
            } else {
                await updateDoc(doc(db, 'merchants', editingId), dataToSave);
                alert('Comércio atualizado com sucesso!');
            }

            // Reset
            setIsCreating(false);
            setEditingId(null);
            setFormData(initialFormState);
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert('Erro ao salvar. Verifique se o Firebase está conectado.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este comércio?')) {
            try {
                await deleteDoc(doc(db, 'merchants', id));
            } catch (error) {
                console.error("Erro ao excluir:", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-indigo-700 text-white p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="text-yellow-400" /> Painel do Gestor
                        </h2>
                        <p className="text-indigo-200 text-sm">Gerencie comércios, planos e promoções</p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* Sidebar / List */}
                    <div className={`${(isCreating || editingId) ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col border-r border-gray-100 bg-gray-50`}>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 bg-white">
                            <button
                                onClick={() => { setIsCreating(false); setEditingId(null); }}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 ${!isCreating && !editingId && editingId !== 'analytics' && editingId !== 'news' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}
                            >
                                Comércios
                            </button>
                            <button
                                onClick={() => { setIsCreating(false); setEditingId('analytics'); }}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 ${editingId === 'analytics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}
                            >
                                Relatórios
                            </button>
                            <button
                                onClick={() => { setIsCreating(false); setEditingId('news'); }}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 ${editingId === 'news' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}
                            >
                                Notícias
                            </button>
                        </div>

                        {editingId !== 'analytics' && editingId !== 'news' ? (
                            <>
                                <div className="p-4 border-b border-gray-200 space-y-3">
                                    <button
                                        onClick={handleCreate}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-sm hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Plus size={20} /> Novo Comércio
                                    </button>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Buscar na lista..."
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {filteredMerchants.map(m => (
                                        <div
                                            key={m.id}
                                            onClick={() => handleEdit(m)}
                                            className={`p-4 rounded-xl cursor-pointer border transition-all hover:shadow-md
                        ${editingId === m.id ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-white border-gray-100 hover:border-indigo-200'}
                      `}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-800 line-clamp-1">{m.name}</h4>
                                                {m.plan === 'super' && <Trophy size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
                                                {m.plan === 'premium' && <Star size={14} className="text-yellow-500 fill-yellow-500 shrink-0" />}
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{m.category}</span>
                                                {m.promotion && <span className="text-green-600 font-bold flex items-center gap-1"><Tag size={10} /> Promo</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : editingId === 'news' ? (
                            <div className="p-4 space-y-4 overflow-y-auto flex-1">
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h3 className="font-bold text-indigo-800 mb-2">Nova Notícia</h3>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target;
                                        const title = form.title.value;
                                        const content = form.content.value;
                                        const tag = form.tag.value;

                                        if (!title || !content) return;

                                        await addDoc(collection(db, 'news'), {
                                            title, content, tag,
                                            createdAt: serverTimestamp(),
                                            date: new Date().toLocaleDateString('pt-BR')
                                        });
                                        form.reset();
                                        alert('Notícia publicada!');
                                    }} className="space-y-3">
                                        <input name="title" placeholder="Título da Notícia" className="w-full p-2 rounded-lg border" required />
                                        <textarea name="content" placeholder="Conteúdo..." className="w-full p-2 rounded-lg border" rows="3" required />
                                        <select name="tag" className="w-full p-2 rounded-lg border">
                                            <option value="Urgente">Urgente</option>
                                            <option value="Evento">Evento</option>
                                            <option value="Novidade">Novidade</option>
                                        </select>
                                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Publicar</button>
                                    </form>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-bold text-gray-700">Últimas Notícias</h3>
                                    <p className="text-xs text-gray-400">As notícias aparecem automaticamente no topo do app.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 space-y-2 overflow-y-auto flex-1">
                                <h3 className="font-bold text-gray-700 mb-2">Top Mais Acessados</h3>
                                {[...merchants].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).map((m, index) => (
                                    <div key={m.id} className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs ${index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-sm text-gray-800 line-clamp-1">{m.name}</p>
                                                <p className="text-xs text-gray-400">{m.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-indigo-600">{m.clicks || 0}</span>
                                            <span className="text-[10px] text-gray-400">cliques</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Main Content / Form */}
                    <div className={`${(!isCreating && !editingId) ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white overflow-y-auto`}>
                        {editingId === 'analytics' ? (
                            <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                                <div className="bg-indigo-50 p-6 rounded-full">
                                    <Trophy size={64} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Painel de Inteligência</h2>
                                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                                        Acompanhe o desempenho dos comércios em tempo real. Os dados são atualizados a cada clique no botão de WhatsApp.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="text-gray-400 text-xs font-bold uppercase">Total de Cliques</h4>
                                        <p className="text-3xl font-bold text-indigo-600 mt-1">
                                            {merchants.reduce((acc, curr) => acc + (curr.clicks || 0), 0)}
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="text-gray-400 text-xs font-bold uppercase">Comércio Top #1</h4>
                                        <p className="text-lg font-bold text-gray-800 mt-1 line-clamp-1">
                                            {[...merchants].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]?.name || '-'}
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="text-gray-400 text-xs font-bold uppercase">Categorias</h4>
                                        <p className="text-3xl font-bold text-gray-800 mt-1">{categories.length}</p>
                                    </div>
                                </div>
                            </div>
                        ) : editingId === 'news' ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                <div className="bg-indigo-50 p-6 rounded-full mb-4">
                                    <Bell size={48} className="text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-600 mb-2">Central de Notícias</h3>
                                <p className="max-w-md">Use o formulário na barra lateral para publicar novidades, eventos ou avisos urgentes para todos os usuários do app.</p>
                            </div>
                        ) : (isCreating || editingId) ? (
                            <form onSubmit={handleSave} className="p-6 max-w-3xl mx-auto w-full space-y-6">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {isCreating ? 'Cadastrar Novo' : 'Editar Comércio'}
                                    </h3>
                                    {!isCreating && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(editingId)}
                                            className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <Trash2 size={16} /> Excluir
                                        </button>
                                    )}
                                </div>

                                {/* Plan Selection */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'basic', label: 'Básico', icon: <Store />, color: 'bg-gray-100 border-gray-200' },
                                        { id: 'premium', label: 'Destaque', icon: <Star className="fill-current" />, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                                        { id: 'super', label: 'Super', icon: <Trophy className="fill-current" />, color: 'bg-amber-50 border-amber-200 text-amber-700' }
                                    ].map(plan => (
                                        <label
                                            key={plan.id}
                                            className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all
                        ${formData.plan === plan.id ? `border-indigo-600 ring-1 ring-indigo-600 ${plan.color}` : 'border-transparent bg-gray-50 hover:bg-gray-100'}
                      `}
                                        >
                                            <input
                                                type="radio"
                                                name="plan"
                                                value={plan.id}
                                                checked={formData.plan === plan.id}
                                                onChange={e => setFormData({ ...formData, plan: e.target.value })}
                                                className="hidden"
                                            />
                                            <div className={formData.plan === plan.id ? 'text-indigo-600' : 'text-gray-400'}>
                                                {plan.icon}
                                            </div>
                                            <span className="font-bold text-sm">{plan.label}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Nome do Negócio</label>
                                        <input
                                            required
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ex: Padaria Estrela"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Categoria</label>
                                        <select
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.filter(c => c.id !== 'Todos').map(c => (
                                                <option key={c.id} value={c.id}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Descrição</label>
                                    <textarea
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Descreva os produtos e serviços..."
                                    />
                                </div>

                                {/* Contact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">WhatsApp (apenas números)</label>
                                        <input
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={formData.whatsapp}
                                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                            placeholder="Ex: 12999998888"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Endereço</label>
                                        <input
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Ex: Av. Principal, 100"
                                        />
                                    </div>
                                </div>

                                {/* Promotion */}
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-2">
                                    <label className="text-sm font-bold text-green-800 flex items-center gap-2">
                                        <Tag size={16} /> Promoção Ativa
                                    </label>
                                    <input
                                        className="w-full p-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.promotion}
                                        onChange={e => setFormData({ ...formData, promotion: e.target.value })}
                                        placeholder="Ex: 10% de desconto informando que viu no Guia!"
                                    />
                                    <p className="text-xs text-green-600">Este texto aparecerá destacado no card do comércio.</p>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { setIsCreating(false); setEditingId(null); }}
                                        className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Save size={20} /> Salvar Alterações
                                    </button>
                                </div>

                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                <div className="bg-gray-100 p-6 rounded-full mb-4">
                                    <Edit size={48} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-600 mb-2">Selecione um comércio</h3>
                                <p>Clique em um item da lista ao lado para editar ou crie um novo.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
