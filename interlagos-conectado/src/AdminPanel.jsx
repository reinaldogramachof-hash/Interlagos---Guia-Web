import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useAuth } from './context/AuthContext';
import { Shield, AlertTriangle, CheckCircle, X, Trophy, Bell, Heart, User, Database, Search, Plus, Save } from 'lucide-react';
import Seeder from './Seeder';
import { createNotification } from './services/notificationService';

export default function AdminPanel({ onClose }) {
    const { currentUser, isMaster, isAdmin } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('moderation'); // moderation, merchants, news, campaigns, users, database

    // Moderation State
    const [pendingAds, setPendingAds] = useState([]);
    const [pendingCampaigns, setPendingCampaigns] = useState([]);

    // Users State (Master Only)
    const [users, setUsers] = useState([]);

    // Merchants State
    const [merchants, setMerchants] = useState([]);

    // Security Check
    if (!currentUser || (!isMaster && !isAdmin)) {
        return (
            <div className="fixed inset-0 z-[60] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl max-w-md text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
                    <p className="text-gray-500 mb-6">Você não tem permissão de Administrador.</p>
                    <button onClick={onClose} className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (activeTab === 'moderation') {
            fetchPendingItems();
        } else if (activeTab === 'users' && isMaster) {
            fetchUsers();
        } else if (activeTab === 'merchants') {
            fetchMerchants();
        }
    }, [activeTab, isMaster]);

    const fetchUsers = async () => {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));
            setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchMerchants = async () => {
        try {
            const merchantsSnap = await getDocs(collection(db, 'merchants'));
            setMerchants(merchantsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error fetching merchants:", error);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!isMaster) return;
        if (window.confirm(`Tem certeza que deseja alterar o cargo deste usuário para ${newRole}?`)) {
            try {
                await updateDoc(doc(db, 'users', userId), { role: newRole });
                fetchUsers();
            } catch (error) {
                console.error("Error changing role:", error);
            }
        }
    };

    const handleBanUser = async (userId) => {
        if (!isMaster) return;
        if (window.confirm('Tem certeza que deseja banir este usuário? Ele perderá o acesso.')) {
            try {
                // In a real app, you'd also disable in Auth via Cloud Functions
                await updateDoc(doc(db, 'users', userId), { banned: true, role: 'banned' });
                fetchUsers();
            } catch (error) {
                console.error("Error banning user:", error);
            }
        }
    };

    const fetchPendingItems = async () => {
        try {
            const adsQ = query(collection(db, 'ads'), where('status', '==', 'pending'));
            const adsSnap = await getDocs(adsQ);
            setPendingAds(adsSnap.docs.map(d => ({ id: d.id, type: 'Anúncio', ...d.data() })));

            const campaignsQ = query(collection(db, 'campaigns'), where('status', '==', 'pending'));
            const campaignsSnap = await getDocs(campaignsQ);
            setPendingCampaigns(campaignsSnap.docs.map(d => ({ id: d.id, type: 'Campanha', ...d.data() })));
        } catch (error) {
            console.error("Error fetching pending items:", error);
        }
    };

    const handleApprove = async (collectionName, id) => {
        try {
            await updateDoc(doc(db, collectionName, id), { status: 'approved' });

            // Get the item to find the author
            // Note: In a real app we might want to fetch this first or pass it in
            // For now, let's assume we can find it in our local state
            const item = [...pendingAds, ...pendingCampaigns].find(i => i.id === id);
            if (item && item.authorId) {
                await createNotification(
                    item.authorId,
                    'Aprovação Concluída',
                    `Seu ${item.type === 'Anúncio' ? 'anúncio' : 'campanha'} "${item.title}" foi aprovado e já está visível!`,
                    'success'
                );
            }

            fetchPendingItems(); // Refresh
        } catch (error) {
            console.error("Error approving:", error);
        }
    };

    const handleReject = async (collectionName, id) => {
        if (window.confirm('Rejeitar e excluir este item?')) {
            try {
                const item = [...pendingAds, ...pendingCampaigns].find(i => i.id === id);

                await deleteDoc(doc(db, collectionName, id));

                if (item && item.authorId) {
                    await createNotification(
                        item.authorId,
                        'Item Rejeitado',
                        `Seu ${item.type === 'Anúncio' ? 'anúncio' : 'campanha'} "${item.title}" não atendeu às diretrizes e foi removido. Verifique as regras e tente novamente.`,
                        'warning'
                    );
                }

                fetchPendingItems(); // Refresh
            } catch (error) {
                console.error("Error rejecting:", error);
            }
        }
    };

    // Merchant Form Logic
    const initialMerchantForm = { name: '', category: 'Alimentação', description: '', phone: '', whatsapp: '', address: '', plan: 'basic', promotion: '' };
    const [merchantForm, setMerchantForm] = useState(initialMerchantForm);

    const handleSaveMerchant = async (e) => {
        e.preventDefault();
        try {
            const dataToSave = { ...merchantForm, isPremium: merchantForm.plan !== 'basic', updatedAt: serverTimestamp() };
            if (isCreating) {
                await addDoc(collection(db, 'merchants'), { ...dataToSave, createdAt: serverTimestamp(), views: 0, rating: 0 });
            } else {
                await updateDoc(doc(db, 'merchants', editingId), dataToSave);
            }
            setIsCreating(false); setEditingId(null); setMerchantForm(initialMerchantForm);
            alert('Salvo com sucesso!');
            fetchMerchants();
        } catch (error) { console.error(error); }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Shield className="text-emerald-400" /> Painel Administrativo
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Logado como: <span className="text-white font-bold">{isMaster ? 'Master' : 'Admin'}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
                        <button onClick={() => setActiveTab('moderation')} className={`p-4 text-left font-bold text-sm flex items-center gap-2 ${activeTab === 'moderation' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500'}`}>
                            <AlertTriangle size={18} /> Moderação
                            {(pendingAds.length + pendingCampaigns.length) > 0 && (
                                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">{pendingAds.length + pendingCampaigns.length}</span>
                            )}
                        </button>
                        <button onClick={() => setActiveTab('merchants')} className={`p-4 text-left font-bold text-sm flex items-center gap-2 ${activeTab === 'merchants' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500'}`}>
                            <Trophy size={18} /> Comércios
                        </button>
                        <button onClick={() => setActiveTab('news')} className={`p-4 text-left font-bold text-sm flex items-center gap-2 ${activeTab === 'news' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500'}`}>
                            <Bell size={18} /> Notícias
                        </button>
                        <button onClick={() => setActiveTab('campaigns')} className={`p-4 text-left font-bold text-sm flex items-center gap-2 ${activeTab === 'campaigns' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500'}`}>
                            <Heart size={18} /> Campanhas
                        </button>
                        {isMaster && (
                            <button onClick={() => setActiveTab('users')} className={`p-4 text-left font-bold text-sm flex items-center gap-2 ${activeTab === 'users' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500'}`}>
                                <User size={18} /> Usuários (Master)
                            </button>
                        )}
                        {isMaster && (
                            <button onClick={() => setActiveTab('database')} className={`p-4 text-left font-bold text-sm flex items-center gap-2 ${activeTab === 'database' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500'}`}>
                                <Database size={18} /> Banco de Dados
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white overflow-y-auto p-6">

                        {/* --- MODERATION TAB --- */}
                        {activeTab === 'moderation' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                                        <AlertTriangle className="text-yellow-500" /> Pendente de Aprovação
                                    </h3>

                                    {pendingAds.length === 0 && pendingCampaigns.length === 0 && (
                                        <div className="p-8 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                                            <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
                                            <p className="text-emerald-800 font-medium">Tudo limpo! Nada para moderar.</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {[...pendingAds, ...pendingCampaigns].map(item => (
                                            <ModerationCard
                                                key={item.id}
                                                item={item}
                                                onApprove={handleApprove}
                                                onReject={handleReject}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- MERCHANTS TAB --- */}
                        {activeTab === 'merchants' && (
                            <div className="flex gap-6 h-full">
                                {/* List */}
                                <div className="w-1/3 border-r border-gray-100 pr-4 flex flex-col">
                                    <div className="mb-4 space-y-2">
                                        <button onClick={() => { setIsCreating(true); setEditingId(null); setMerchantForm(initialMerchantForm); }} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"><Plus size={16} /> Novo</button>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                            <input className="w-full pl-9 p-2 border rounded-lg text-slate-900" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-2">
                                        {merchants.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                                            <div key={m.id} onClick={() => { setEditingId(m.id); setIsCreating(false); setMerchantForm(m); }} className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${editingId === m.id ? 'border-indigo-500 ring-1 ring-indigo-500' : ''}`}>
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
                                                <input className="border p-2 rounded text-slate-900" placeholder="Nome" value={merchantForm.name} onChange={e => setMerchantForm({ ...merchantForm, name: e.target.value })} required />
                                                <select className="border p-2 rounded text-slate-900" value={merchantForm.category} onChange={e => setMerchantForm({ ...merchantForm, category: e.target.value })}>
                                                    {['Alimentação', 'Saúde', 'Automotivo', 'Beleza', 'Serviços', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <textarea className="border p-2 rounded w-full text-slate-900" rows="2" placeholder="Descrição" value={merchantForm.description} onChange={e => setMerchantForm({ ...merchantForm, description: e.target.value })} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="border p-2 rounded text-slate-900" placeholder="WhatsApp" value={merchantForm.whatsapp} onChange={e => setMerchantForm({ ...merchantForm, whatsapp: e.target.value })} />
                                                <input className="border p-2 rounded text-slate-900" placeholder="Endereço" value={merchantForm.address} onChange={e => setMerchantForm({ ...merchantForm, address: e.target.value })} />
                                            </div>
                                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold"><Save size={16} className="inline mr-1" /> Salvar</button>
                                        </form>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400">Selecione para editar</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- NEWS TAB --- */}
                        {activeTab === 'news' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2"><Bell size={20} /> Publicar Notícia Oficial</h3>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const f = e.target;
                                        await addDoc(collection(db, 'news'), {
                                            title: f.title.value,
                                            summary: f.summary.value,
                                            category: f.category.value,
                                            date: new Date().toLocaleDateString('pt-BR'),
                                            createdAt: serverTimestamp(),
                                            authorId: currentUser.uid
                                        });
                                        f.reset();
                                        alert('Notícia publicada!');
                                    }} className="space-y-4">
                                        <input name="title" placeholder="Título" className="w-full border p-2 rounded text-slate-900" required />
                                        <textarea name="summary" placeholder="Resumo..." className="w-full border p-2 rounded text-slate-900" rows="2" required />
                                        <select name="category" className="w-full border p-2 rounded text-slate-900">
                                            <option>Eventos</option>
                                            <option>Urgente</option>
                                            <option>Comunidade</option>
                                        </select>
                                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Publicar</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* --- USERS TAB (MASTER ONLY) --- */}
                        {activeTab === 'users' && isMaster && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                        <User className="text-indigo-600" /> Gerenciamento de Usuários
                                    </h3>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                        <input
                                            className="pl-9 p-2 border rounded-lg w-64 text-slate-900"
                                            placeholder="Buscar usuário..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                            <tr>
                                                <th className="p-4">Usuário</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Função</th>
                                                <th className="p-4 text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {users.filter(u => u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                                                            {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <User className="p-1 text-slate-400" />}
                                                        </div>
                                                        <span className="font-bold text-slate-900">{user.displayName || 'Sem Nome'}</span>
                                                    </td>
                                                    <td className="p-4 text-slate-500">{user.email}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'master' ? 'bg-purple-100 text-purple-700' :
                                                            user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                                                                'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {user.role === 'master' ? 'Master' : user.role === 'admin' ? 'Admin' : 'Usuário'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        {user.role !== 'master' && (
                                                            <>
                                                                {user.role === 'admin' ? (
                                                                    <button onClick={() => handleRoleChange(user.id, 'user')} className="text-orange-600 hover:bg-orange-50 px-3 py-1 rounded-lg font-bold text-xs border border-orange-200">
                                                                        Rebaixar
                                                                    </button>
                                                                ) : (
                                                                    <button onClick={() => handleRoleChange(user.id, 'admin')} className="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg font-bold text-xs border border-indigo-200">
                                                                        Promover Admin
                                                                    </button>
                                                                )}
                                                                <button onClick={() => handleBanUser(user.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg font-bold text-xs border border-red-200">
                                                                    Banir
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* --- DATABASE TAB --- */}
                        {activeTab === 'database' && isMaster && (
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

function ModerationCard({ item, onApprove, onReject }) {
    const [isReviewing, setIsReviewing] = useState(false);
    const [checks, setChecks] = useState({
        realPhoto: false,
        safeDescription: false,
        safeHistory: false,
        communitySense: false
    });

    const allChecked = Object.values(checks).every(Boolean);

    const handleCheck = (key) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (isReviewing) {
        return (
            <div className="bg-slate-50 border-2 border-indigo-100 p-6 rounded-xl shadow-sm animate-in fade-in">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Revisão de Segurança</h4>
                <p className="text-sm text-slate-500 mb-4">Para aprovar este item, verifique os pontos abaixo:</p>

                <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" checked={checks.realPhoto} onChange={() => handleCheck('realPhoto')} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                        <span className="text-sm font-medium text-slate-700">A foto parece real e legítima?</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" checked={checks.safeDescription} onChange={() => handleCheck('safeDescription')} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                        <span className="text-sm font-medium text-slate-700">A descrição não contém dados sensíveis ou ofensivos?</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" checked={checks.safeHistory} onChange={() => handleCheck('safeHistory')} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                        <span className="text-sm font-medium text-slate-700">O usuário não possui histórico suspeito?</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" checked={checks.communitySense} onChange={() => handleCheck('communitySense')} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                        <span className="text-sm font-medium text-slate-700">O pedido faz sentido para a comunidade?</span>
                    </label>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onApprove(item.type === 'Anúncio' ? 'ads' : 'campaigns', item.id)}
                        disabled={!allChecked}
                        className="flex-1 bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <CheckCircle size={20} />
                        Confirmar Aprovação
                    </button>
                    <button
                        onClick={() => setIsReviewing(false)}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-start">
            <div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block ${item.type === 'Anúncio' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    {item.type === 'donation' ? 'Doação' : item.type === 'request' ? 'Pedido' : item.type === 'volunteer' ? 'Voluntário' : item.type}
                </span>
                <h4 className="font-bold text-lg text-slate-900">{item.title}</h4>
                <p className="text-slate-500 text-sm mb-2 line-clamp-2">{item.description}</p>
                <p className="text-xs text-slate-400">Autor: {item.authorName}</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setIsReviewing(true)}
                    className="bg-indigo-50 text-indigo-700 p-2 rounded-lg hover:bg-indigo-100 transition-colors font-bold text-sm flex items-center gap-1"
                >
                    <Shield size={16} /> Revisar
                </button>
                <button
                    onClick={() => onReject(item.type === 'Anúncio' ? 'ads' : 'campaigns', item.id)}
                    className="bg-red-50 text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors font-bold text-sm flex items-center gap-1"
                >
                    <X size={16} /> Rejeitar
                </button>
            </div>
        </div>
    );
}
