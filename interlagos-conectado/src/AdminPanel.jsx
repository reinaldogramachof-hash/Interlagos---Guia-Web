import React, { useState } from 'react';
import { X, Search, Edit, Trash2, Save, Plus, Star, Trophy, Tag, Bell, Heart, Database } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Seeder from './Seeder';

export default function AdminPanel({ merchants = [], onClose, user }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('merchants'); // merchants, analytics, news, campaigns, database

    // Security Check (Temporarily Disabled for Dev)
    // const ADMIN_EMAILS = ['reinaldogramachof@gmail.com'];
    // if (!user || !ADMIN_EMAILS.includes(user.email)) {
    //     return (
    //         <div className="fixed inset-0 z-[60] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4">
    //             <div className="bg-white p-8 rounded-2xl max-w-md text-center shadow-2xl">
    //                 <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
    //                     <X size={32} />
    //                 </div>
    //                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
    //                 <p className="text-gray-500 mb-6">Você não tem permissão para acessar este painel.</p>
    //                 <button onClick={onClose} className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors">
    //                     Voltar
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    // Formulário Comércio
    const initialMerchantForm = {
        name: '', category: 'Alimentação', description: '',
        phone: '', whatsapp: '', address: '',
        plan: 'basic', promotion: ''
    };
    const [merchantForm, setMerchantForm] = useState(initialMerchantForm);

    // Filter merchants
    const filteredMerchants = merchants.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditMerchant = (merchant) => {
        setEditingId(merchant.id);
        setIsCreating(false);
        setMerchantForm({
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

    const handleSaveMerchant = async (e) => {
        e.preventDefault();
        try {
            const dataToSave = {
                ...merchantForm,
                isPremium: merchantForm.plan === 'premium' || merchantForm.plan === 'super',
                updatedAt: serverTimestamp()
            };

            if (isCreating) {
                await addDoc(collection(db, 'merchants'), {
                    ...dataToSave,
                    createdAt: serverTimestamp(),
                    views: 0,
                    rating: merchantForm.plan === 'super' ? 5.0 : 0
                });
                alert('Comércio criado!');
            } else {
                await updateDoc(doc(db, 'merchants', editingId), dataToSave);
                alert('Comércio atualizado!');
            }
            setIsCreating(false);
            setEditingId(null);
            setMerchantForm(initialMerchantForm);
        } catch (error) {
            console.error("Erro:", error);
            alert('Erro ao salvar.');
        }
    };

    const handleDelete = async (collectionName, id) => {
        if (window.confirm('Tem certeza?')) {
            try {
                await deleteDoc(doc(db, collectionName, id));
            } catch (error) { console.error(error); }
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
                        <p className="text-indigo-200 text-sm">Gerencie todo o ecossistema</p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 flex flex-col">
                        <button onClick={() => { setActiveTab('merchants'); setIsCreating(false); setEditingId(null); }} className={`p-4 text-left font-bold text-sm ${activeTab === 'merchants' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-500'}`}>Comércios</button>
                        <button onClick={() => setActiveTab('campaigns')} className={`p-4 text-left font-bold text-sm ${activeTab === 'campaigns' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-500'}`}>Campanhas Solidárias</button>
                        <button onClick={() => setActiveTab('news')} className={`p-4 text-left font-bold text-sm ${activeTab === 'news' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-500'}`}>Notícias</button>
                        <button onClick={() => setActiveTab('analytics')} className={`p-4 text-left font-bold text-sm ${activeTab === 'analytics' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-500'}`}>Relatórios</button>
                        <button onClick={() => setActiveTab('database')} className={`p-4 text-left font-bold text-sm ${activeTab === 'database' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-500'}`}>Banco de Dados</button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white overflow-y-auto p-6">

                        {/* --- MERCHANTS TAB --- */}
                        {activeTab === 'merchants' && (
                            <div className="flex gap-6 h-full">
                                {/* List */}
                                <div className="w-1/3 border-r border-gray-100 pr-4 flex flex-col">
                                    <div className="mb-4 space-y-2">
                                        <button onClick={() => { setIsCreating(true); setEditingId(null); setMerchantForm(initialMerchantForm); }} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"><Plus size={16} /> Novo</button>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                            <input className="w-full pl-9 p-2 border rounded-lg" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-2">
                                        {filteredMerchants.map(m => (
                                            <div key={m.id} onClick={() => handleEditMerchant(m)} className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${editingId === m.id ? 'border-indigo-500 ring-1 ring-indigo-500' : ''}`}>
                                                <div className="font-bold text-sm">{m.name}</div>
                                                <div className="text-xs text-gray-500">{m.category}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="flex-1 pl-2">
                                    {(isCreating || editingId) ? (
                                        <form onSubmit={handleSaveMerchant} className="space-y-4">
                                            <h3 className="font-bold text-lg">{isCreating ? 'Novo Comércio' : 'Editando Comércio'}</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="border p-2 rounded" placeholder="Nome" value={merchantForm.name} onChange={e => setMerchantForm({ ...merchantForm, name: e.target.value })} required />
                                                <select className="border p-2 rounded" value={merchantForm.category} onChange={e => setMerchantForm({ ...merchantForm, category: e.target.value })}>
                                                    {['Alimentação', 'Saúde', 'Automotivo', 'Beleza', 'Serviços', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <textarea className="border p-2 rounded w-full" rows="2" placeholder="Descrição" value={merchantForm.description} onChange={e => setMerchantForm({ ...merchantForm, description: e.target.value })} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="border p-2 rounded" placeholder="WhatsApp (num)" value={merchantForm.whatsapp} onChange={e => setMerchantForm({ ...merchantForm, whatsapp: e.target.value })} />
                                                <input className="border p-2 rounded" placeholder="Endereço" value={merchantForm.address} onChange={e => setMerchantForm({ ...merchantForm, address: e.target.value })} />
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded border">
                                                <label className="font-bold text-sm block mb-2">Plano</label>
                                                <div className="flex gap-4">
                                                    {['basic', 'premium', 'super'].map(p => (
                                                        <label key={p} className="flex items-center gap-1 cursor-pointer">
                                                            <input type="radio" name="plan" value={p} checked={merchantForm.plan === p} onChange={e => setMerchantForm({ ...merchantForm, plan: e.target.value })} />
                                                            <span className="capitalize">{p}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded font-bold"><Save size={16} className="inline mr-1" /> Salvar</button>
                                                {!isCreating && <button type="button" onClick={() => handleDelete('merchants', editingId)} className="bg-red-100 text-red-600 px-4 rounded font-bold"><Trash2 size={16} /></button>}
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400">Selecione um comércio para editar</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- CAMPAIGNS TAB --- */}
                        {activeTab === 'campaigns' && (
                            <div className="space-y-6">
                                <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                                    <h3 className="font-bold text-pink-800 mb-4 flex items-center gap-2"><Heart size={20} /> Criar Nova Campanha</h3>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const f = e.target;
                                        await addDoc(collection(db, 'campaigns'), {
                                            title: f.title.value,
                                            organizer: f.organizer.value,
                                            goal: f.goal.value,
                                            raised: 'R$ 0',
                                            progress: 0,
                                            description: f.description.value,
                                            createdAt: serverTimestamp()
                                        });
                                        f.reset();
                                        alert('Campanha criada!');
                                    }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input name="title" placeholder="Título da Campanha" className="border p-2 rounded" required />
                                        <input name="organizer" placeholder="Organizador (ex: ONG X)" className="border p-2 rounded" required />
                                        <input name="goal" placeholder="Meta (ex: R$ 5.000)" className="border p-2 rounded" required />
                                        <textarea name="description" placeholder="Descrição completa..." className="border p-2 rounded md:col-span-2" rows="2" required />
                                        <button type="submit" className="md:col-span-2 bg-pink-600 text-white py-2 rounded font-bold hover:bg-pink-700">Lançar Campanha</button>
                                    </form>
                                </div>
                                <p className="text-sm text-gray-500">Gerencie as campanhas ativas diretamente na aba de Doações.</p>
                            </div>
                        )}

                        {/* --- NEWS TAB --- */}
                        {activeTab === 'news' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2"><Bell size={20} /> Publicar Notícia</h3>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const f = e.target;
                                        await addDoc(collection(db, 'news'), {
                                            title: f.title.value,
                                            summary: f.summary.value,
                                            category: f.category.value,
                                            date: new Date().toLocaleDateString('pt-BR'),
                                            createdAt: serverTimestamp()
                                        });
                                        f.reset();
                                        alert('Notícia publicada!');
                                    }} className="space-y-4">
                                        <input name="title" placeholder="Título" className="w-full border p-2 rounded" required />
                                        <textarea name="summary" placeholder="Resumo..." className="w-full border p-2 rounded" rows="2" required />
                                        <select name="category" className="w-full border p-2 rounded">
                                            <option>Eventos</option>
                                            <option>Urgente</option>
                                            <option>Comunidade</option>
                                        </select>
                                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Publicar</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* --- ANALYTICS TAB --- */}
                        {activeTab === 'analytics' && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Trophy size={64} className="text-indigo-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-600">Relatórios em Breve</h3>
                                <p className="text-gray-400">Em breve você verá gráficos de acesso aqui.</p>
                            </div>
                        )}

                        {/* --- DATABASE TAB --- */}
                        {activeTab === 'database' && (
                            <div className="h-full overflow-y-auto">
                                <Seeder />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
