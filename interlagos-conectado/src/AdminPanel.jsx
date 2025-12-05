import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { useAuth } from './context/AuthContext';
import { Shield, AlertTriangle, CheckCircle, X, Trophy, Bell, Heart, User, Database, Search, Plus, Save, ClipboardList, FileText, Trash2 } from 'lucide-react';
import Seeder from './Seeder';
import { createNotification } from './services/notificationService';

export default function AdminPanel({ onClose }) {
    const { currentUser, isMaster, isAdmin } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('approvals'); // approvals, merchants, news, campaigns, users, database, audit

    // Moderation State
    const [pendingAds, setPendingAds] = useState([]);
    const [pendingCampaigns, setPendingCampaigns] = useState([]);

    // Users State (Master Only)
    const [users, setUsers] = useState([]);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'user' });

    // Merchants State
    const [merchants, setMerchants] = useState([]);

    // News & Campaigns State (Active)
    const [newsList, setNewsList] = useState([]);
    const [activeCampaigns, setActiveCampaigns] = useState([]);

    // Logs & Tickets State
    const [logs, setLogs] = useState([]);
    const [tickets, setTickets] = useState([]);

    // Escalation State
    const [escalationTarget, setEscalationTarget] = useState(null); // { id, collection, title }
    const [escalationReason, setEscalationReason] = useState('');

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
        if (activeTab === 'approvals') {
            fetchPendingItems();
        } else if (activeTab === 'users' && isMaster) {
            fetchUsers();
        } else if (activeTab === 'merchants') {
            fetchMerchants();
        } else if (activeTab === 'news') {
            fetchNews();
        } else if (activeTab === 'campaigns') {
            fetchActiveCampaigns();
        } else if (activeTab === 'audit' && isMaster) {
            fetchLogs();
        } else if (activeTab === 'tickets' && isMaster) {
            fetchTickets();
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

    const fetchNews = async () => {
        try {
            const snap = await getDocs(collection(db, 'news'));
            setNewsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) { console.error(error); }
    };

    const fetchActiveCampaigns = async () => {
        try {
            const snap = await getDocs(query(collection(db, 'campaigns')));
            setActiveCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) { console.error(error); }
    };

    const fetchLogs = async () => {
        setLogs([
            { id: 1, action: 'User Login', details: 'Admin user logged in', timestamp: new Date(), user: 'admin@temnobairro.com' },
            { id: 2, action: 'Merchant Created', details: 'New merchant "Padaria X" created', timestamp: new Date(Date.now() - 3600000), user: 'master@temnobairro.com' },
            { id: 3, action: 'Ad Approved', details: 'Ad "Promoção Relâmpago" approved', timestamp: new Date(Date.now() - 7200000), user: 'master@temnobairro.com' },
        ]);
    };

    const fetchTickets = async () => {
        try {
            const q = query(collection(db, 'tickets'), where('status', '==', 'open'));
            const snap = await getDocs(q);
            setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) { console.error(error); }
    };

    const handleResolveTicket = async (ticketId, resolution) => {
        if (window.confirm(`Deseja marcar esta solicitação como ${resolution}?`)) {
            try {
                await updateDoc(doc(db, 'tickets', ticketId), {
                    status: resolution,
                    resolvedAt: serverTimestamp(),
                    resolvedBy: currentUser.email
                });
                fetchTickets();
            } catch (error) { console.error(error); }
        }
    };


    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Auth User using Secondary App (to avoid logging out admin)
            const secondaryApp = initializeApp(firebaseConfig, "Secondary");
            const secondaryAuth = getAuth(secondaryApp);
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, userForm.email, userForm.password);
            const newUser = userCredential.user;

            // 2. Create User Profile in Firestore
            await setDoc(doc(db, 'users', newUser.uid), {
                uid: newUser.uid,
                displayName: userForm.name,
                email: userForm.email,
                role: userForm.role,
                photoURL: null,
                createdAt: serverTimestamp(),
                favorites: [] // Initialize favorites
            });

            // 3. Clean up
            await signOut(secondaryAuth);
            // Note: We can't easily delete the secondary app instance in JS SDK, but it's fine for this use case.

            alert(`Usuário ${userForm.name} criado com sucesso!`);
            setIsCreatingUser(false);
            setUserForm({ name: '', email: '', password: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Erro ao criar usuário: " + error.message);
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

    const openEscalationModal = (collectionName, id, itemTitle) => {
        setEscalationTarget({ id, collection: collectionName, title: itemTitle });
        setEscalationReason('');
    };

    const confirmEscalation = async () => {
        if (!escalationReason.trim()) return alert('Por favor, informe o motivo.');

        try {
            // 1. Create Ticket
            await addDoc(collection(db, 'tickets'), {
                type: 'escalation',
                targetId: escalationTarget.id,
                targetCollection: escalationTarget.collection,
                targetTitle: escalationTarget.title,
                status: 'open',
                reason: escalationReason,
                createdBy: currentUser.email,
                createdAt: serverTimestamp()
            });

            // 2. Update item status to 'escalated' to hide from Admin
            await updateDoc(doc(db, escalationTarget.collection, escalationTarget.id), {
                status: 'escalated'
            });

            alert('Item escalado com sucesso para a Torre de Controle!');
            setEscalationTarget(null);
            fetchPendingItems();
        } catch (error) {
            console.error("Error escalating:", error);
            alert("Erro ao escalar: " + error.message);
        }
    };

    const handleDeleteItem = async (collectionName, id) => {
        if (window.confirm('Tem certeza que deseja excluir este item permanentemente?')) {
            try {
                await deleteDoc(doc(db, collectionName, id));
                if (collectionName === 'news') fetchNews();
                if (collectionName === 'campaigns') fetchActiveCampaigns();
            } catch (error) { console.error(error); }
        }
    };

    // Merchant Form Logic
    const initialMerchantForm = {
        name: '',
        category: 'Alimentação',
        description: '',
        phone: '',
        whatsapp: '',
        address: '',
        plan: 'free',
        socialLinks: { instagram: '', facebook: '', site: '' },
        gallery: []
    };
    const [merchantForm, setMerchantForm] = useState(initialMerchantForm);

    const handleSaveMerchant = async (e) => {
        e.preventDefault();
        try {
            // Sanitize WhatsApp (remove everything except numbers)
            const cleanWhatsapp = merchantForm.whatsapp.replace(/\D/g, '');

            const dataToSave = {
                ...merchantForm,
                whatsapp: cleanWhatsapp,
                plan: merchantForm.plan,
                isPremium: ['professional', 'premium'].includes(merchantForm.plan),
                updatedAt: serverTimestamp()
            };

            if (isCreating) {
                await addDoc(collection(db, 'merchants'), { ...dataToSave, createdAt: serverTimestamp(), views: 0, rating: 0 });
            } else {
                await updateDoc(doc(db, 'merchants', editingId), dataToSave);
            }
            setIsCreating(false); setEditingId(null); setMerchantForm(initialMerchantForm);
            alert('Comércio salvo com sucesso!');
            fetchMerchants();
        } catch (error) { console.error(error); alert('Erro ao salvar.'); }
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
                        <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                            {isMaster ? (
                                <>
                                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded textxs font-bold border border-purple-500/30 flex items-center gap-1">
                                        <Database size={12} /> MASTER
                                    </span>
                                    <span>Acesso Total</span>
                                </>
                            ) : (
                                <>
                                    <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-bold border border-blue-500/30 flex items-center gap-1">
                                        <Shield size={12} /> ADMIN
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500"><Lock size={12} /> Acesso Limitado</span>
                                </>
                            )}
                        </p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col py-6 gap-1 overflow-y-auto">

                        <div className="px-6 mb-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operação Diária</h3>
                        </div>

                        <button onClick={() => setActiveTab('approvals')} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'approvals' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                            <CheckCircle size={18} /> Aprovações
                            {(pendingAds.length + pendingCampaigns.length) > 0 && (
                                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto shadow-sm">{pendingAds.length + pendingCampaigns.length}</span>
                            )}
                        </button>
                        <button onClick={() => setActiveTab('merchants')} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'merchants' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                            <Trophy size={18} /> Comércios
                        </button>
                        <button onClick={() => setActiveTab('news')} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'news' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                            <Bell size={18} /> Notícias
                        </button>
                        <button onClick={() => setActiveTab('campaigns')} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'campaigns' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                            <Heart size={18} /> Campanhas
                        </button>

                        {isMaster && (
                            <>
                                <div className="my-4 mx-6 border-t border-slate-200"></div>
                                <div className="px-6 mb-2">
                                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                                        <Shield size={12} /> Governança Master
                                    </h3>
                                </div>

                                <button onClick={() => setActiveTab('tickets')} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'tickets' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    <FileText size={18} /> Torre de Controle
                                    {tickets.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto shadow-sm">{tickets.length}</span>}
                                </button>
                                <button onClick={() => setActiveTab('users')} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    <User size={18} /> Usuários do Sistema
                                </button>
                                <button onClick={() => setActiveTab('audit')} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'audit' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    <ClipboardList size={18} /> Auditoria e Logs
                                </button>
                                <button onClick={() => setActiveTab('database')} className={`mx-3 px-3 py-2.5 rounded-lg text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'database' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    <Database size={18} /> Banco de Dados
                                </button>
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white overflow-y-auto p-6">

                        {/* --- MODERATION TAB (RENAME TO APPROVALS) --- */}
                        {activeTab === 'approvals' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                                        <CheckCircle className="text-emerald-500" /> Itens Pendentes de Aprovação
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
                                                onEscalate={openEscalationModal}
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
                                            <div key={m.id} onClick={() => { setEditingId(m.id); setIsCreating(false); setMerchantForm(m); }} className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 flex justify-between items-center ${editingId === m.id ? 'border-indigo-500 ring-1 ring-indigo-500' : ''}`}>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-800">{m.name}</div>
                                                    <div className="text-xs text-gray-500">{m.category}</div>
                                                </div>
                                                {m.isPremium && <Trophy size={14} className="text-amber-500" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Form */}
                                <div className="flex-1 pl-2">
                                    {(isCreating || editingId) ? (
                                        <form onSubmit={handleSaveMerchant} className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-lg text-slate-800">{isCreating ? 'Novo Comércio' : 'Editando Comércio'}</h3>
                                                <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                                            </div>

                                            {/* Plan Selection */}
                                            {/* Plan Selection */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                {/* Free */}
                                                <label className={`cursor-pointer border p-3 rounded-lg text-center transition-all ${merchantForm.plan === 'free' ? 'border-gray-500 bg-gray-50 ring-2 ring-gray-200' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <input type="radio" name="plan" value="free" checked={merchantForm.plan === 'free'} onChange={e => setMerchantForm({ ...merchantForm, plan: e.target.value })} className="hidden" />
                                                    <div className="font-bold text-gray-700 mb-1">Grátis</div>
                                                    <div className="text-[10px] text-gray-500 leading-tight">Card simples, sem Zap linkado, prioridade baixa.</div>
                                                </label>

                                                {/* Basic */}
                                                <label className={`cursor-pointer border p-3 rounded-lg text-center transition-all ${merchantForm.plan === 'basic' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <input type="radio" name="plan" value="basic" checked={merchantForm.plan === 'basic'} onChange={e => setMerchantForm({ ...merchantForm, plan: e.target.value })} className="hidden" />
                                                    <div className="font-bold text-blue-700 mb-1">Básico</div>
                                                    <div className="text-[10px] text-blue-600 leading-tight">Card com foto, botão Zap, prioridade normal.</div>
                                                </label>

                                                {/* Professional */}
                                                <label className={`cursor-pointer border p-3 rounded-lg text-center transition-all ${merchantForm.plan === 'professional' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <input type="radio" name="plan" value="professional" checked={merchantForm.plan === 'professional'} onChange={e => setMerchantForm({ ...merchantForm, plan: e.target.value })} className="hidden" />
                                                    <div className="font-bold text-indigo-700 mb-1 flex items-center justify-center gap-1">Pro <Trophy size={12} /></div>
                                                    <div className="text-[10px] text-indigo-600 leading-tight">Destaque, redes sociais, galeria de fotos.</div>
                                                </label>

                                                {/* Premium */}
                                                <label className={`cursor-pointer border p-3 rounded-lg text-center transition-all ${merchantForm.plan === 'premium' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <input type="radio" name="plan" value="premium" checked={merchantForm.plan === 'premium'} onChange={e => setMerchantForm({ ...merchantForm, plan: e.target.value })} className="hidden" />
                                                    <div className="font-bold text-amber-700 mb-1 flex items-center justify-center gap-1">Premium <Trophy size={14} className="fill-amber-500" /></div>
                                                    <div className="text-[10px] text-amber-600 leading-tight">Super destaque, topo da lista, card expandido.</div>
                                                </label>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Estabelecimento</label>
                                                        <input className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Padaria do Bairro" value={merchantForm.name} onChange={e => setMerchantForm({ ...merchantForm, name: e.target.value })} required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Categoria</label>
                                                        <select className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={merchantForm.category} onChange={e => setMerchantForm({ ...merchantForm, category: e.target.value })}>
                                                            {['Alimentação', 'Saúde', 'Automotivo', 'Beleza', 'Serviços', 'Tecnologia', 'Educação', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Descrição Curta</label>
                                                    <textarea className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" rows="2" placeholder="O que este comércio oferece?" value={merchantForm.description} onChange={e => setMerchantForm({ ...merchantForm, description: e.target.value })} />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">WhatsApp (Apenas Números)</label>
                                                        <input
                                                            className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            placeholder="11999999999"
                                                            value={merchantForm.whatsapp}
                                                            onChange={e => setMerchantForm({ ...merchantForm, whatsapp: e.target.value })}
                                                        />
                                                        <p className="text-[10px] text-slate-400 mt-1">Será formatado automaticamente.</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Endereço</label>
                                                        <input className="w-full border p-2.5 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Rua..." value={merchantForm.address} onChange={e => setMerchantForm({ ...merchantForm, address: e.target.value })} />
                                                    </div>
                                                </div>

                                                {/* Social Links (Professional & Premium) */}
                                                {['professional', 'premium'].includes(merchantForm.plan) && (
                                                    <div className="pt-2 border-t border-slate-100">
                                                        <label className="block text-xs font-bold text-slate-500 mb-2">Redes Sociais (Opcional)</label>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <input
                                                                className="border p-2 rounded text-slate-900 text-xs"
                                                                placeholder="Instagram (Ex: @loja)"
                                                                value={merchantForm.socialLinks?.instagram || ''}
                                                                onChange={e => setMerchantForm({ ...merchantForm, socialLinks: { ...merchantForm.socialLinks, instagram: e.target.value } })}
                                                            />
                                                            <input
                                                                className="border p-2 rounded text-slate-900 text-xs"
                                                                placeholder="Facebook (Link)"
                                                                value={merchantForm.socialLinks?.facebook || ''}
                                                                onChange={e => setMerchantForm({ ...merchantForm, socialLinks: { ...merchantForm.socialLinks, facebook: e.target.value } })}
                                                            />
                                                            <input
                                                                className="border p-2 rounded text-slate-900 text-xs"
                                                                placeholder="Site (Link)"
                                                                value={merchantForm.socialLinks?.site || ''}
                                                                onChange={e => setMerchantForm({ ...merchantForm, socialLinks: { ...merchantForm.socialLinks, site: e.target.value } })}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Gallery (Professional & Premium) */}
                                                {['professional', 'premium'].includes(merchantForm.plan) && (
                                                    <div className="pt-4 border-t border-slate-100">
                                                        <label className="block text-xs font-bold text-slate-500 mb-2">Galeria de Fotos (URLs)</label>
                                                        <div className="space-y-2">
                                                            {merchantForm.gallery && merchantForm.gallery.map((url, idx) => (
                                                                <div key={idx} className="flex gap-2">
                                                                    <input readOnly value={url} className="flex-1 border p-2 rounded text-slate-600 text-xs bg-slate-50" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newGallery = merchantForm.gallery.filter((_, i) => i !== idx);
                                                                            setMerchantForm({ ...merchantForm, gallery: newGallery });
                                                                        }}
                                                                        className="text-red-500 hover:text-red-700 p-2"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Cole a URL da imagem aqui"
                                                                    className="flex-1 border p-2 rounded text-slate-900 text-xs"
                                                                    id="new-gallery-image"
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            const url = e.target.value;
                                                                            if (url) {
                                                                                setMerchantForm({ ...merchantForm, gallery: [...(merchantForm.gallery || []), url] });
                                                                                e.target.value = '';
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const input = document.getElementById('new-gallery-image');
                                                                        if (input && input.value) {
                                                                            setMerchantForm({ ...merchantForm, gallery: [...(merchantForm.gallery || []), input.value] });
                                                                            input.value = '';
                                                                        }
                                                                    }}
                                                                    className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded text-xs font-bold hover:bg-indigo-100"
                                                                >
                                                                    Adicionar
                                                                </button>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400">Pressione Enter ou clique em Adicionar.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
                                                <Save size={18} />
                                                {isCreating ? 'Criar Comércio' : 'Salvar Alterações'}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                            <Trophy size={48} className="mb-4 text-gray-200" />
                                            <p>Selecione um comércio para editar ou <button onClick={() => { setIsCreating(true); setEditingId(null); setMerchantForm(initialMerchantForm); }} className="text-indigo-600 font-bold hover:underline">crie um novo</button>.</p>
                                        </div>
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

                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-800">Notícias Publicadas</h3>
                                    {newsList.map(item => (
                                        <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2 inline-block">{item.category}</span>
                                                <h4 className="font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-sm text-slate-500 line-clamp-2">{item.summary}</p>
                                                <div className="text-xs text-slate-400 mt-2">{item.date}</div>
                                            </div>
                                            <button onClick={() => handleDeleteItem('news', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {newsList.length === 0 && <p className="text-slate-400 text-sm">Nenhuma notícia publicada.</p>}
                                </div>
                            </div>
                        )}

                        {/* --- CAMPAIGNS TAB (ACTIVE) --- */}
                        {activeTab === 'campaigns' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                                    <Heart className="text-pink-600" /> Campanhas Ativas
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeCampaigns.map(item => (
                                        <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                                                    {item.type === 'donation' ? 'Doação' : item.type === 'volunteer' ? 'Voluntariado' : 'Campanha'}
                                                </span>
                                                <button onClick={() => handleDeleteItem('campaigns', item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
                                            <div className="flex justify-between items-center text-xs text-slate-400">
                                                <span>Autor: {item.authorName || 'Desconhecido'}</span>
                                                <span>{item.goal ? `Meta: ${item.goal}` : 'Sem meta'}</span>
                                            </div>
                                            {item.progress !== undefined && (
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                                                    <div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min(item.progress, 100)}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {activeCampaigns.length === 0 && (
                                        <div className="col-span-full text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <Heart className="mx-auto mb-2 text-slate-300" size={32} />
                                            <p>Nenhuma campanha ativa no momento.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- USERS TAB (MASTER ONLY) --- */}
                        {activeTab === 'users' && isMaster && (
                            <div className="space-y-6">
                                {!isCreatingUser ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                                <User className="text-indigo-600" /> Gerenciamento de Usuários
                                            </h3>
                                            <div className="flex gap-2">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                                    <input
                                                        className="pl-9 p-2 border rounded-lg w-64 text-slate-900"
                                                        placeholder="Buscar usuário..."
                                                        value={searchTerm}
                                                        onChange={e => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setIsCreatingUser(true)}
                                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                                                >
                                                    <Plus size={18} /> Novo Usuário
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
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
                                                                <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center">
                                                                    {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <User size={16} className="text-slate-400" />}
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
                                    </>
                                ) : (
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-2xl mx-auto shadow-sm">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold text-xl text-slate-800">Criar Novo Usuário</h3>
                                            <button onClick={() => setIsCreatingUser(false)} className="text-gray-400 hover:text-gray-600">
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <form onSubmit={handleCreateUser} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
                                                <input
                                                    className="w-full border p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    placeholder="Nome do Usuário"
                                                    value={userForm.name}
                                                    onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full border p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    placeholder="usuario@email.com"
                                                    value={userForm.email}
                                                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Senha Inicial</label>
                                                <input
                                                    type="text"
                                                    className="w-full border p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    placeholder="Mínimo 6 caracteres"
                                                    value={userForm.password}
                                                    onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Função</label>
                                                <select
                                                    className="w-full border p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    value={userForm.role}
                                                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                                                >
                                                    <option value="user">Usuário Comum</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    * Administradores podem aprovar anúncios/campanhas.<br />
                                                    * Usuários comuns apenas visualizam.
                                                </p>
                                            </div>
                                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                                                Criar Usuário
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- DATABASE TAB --- */}
                        {activeTab === 'database' && isMaster && (
                            <div className="h-full overflow-y-auto">
                                <Seeder />
                            </div>
                        )}

                        {/* --- TICKETS TAB (MASTER INBOX) --- */}
                        {activeTab === 'tickets' && isMaster && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <FileText className="text-indigo-600" /> Solicitações e Documentos (Master Inbox)
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {tickets.map(ticket => (
                                        <div key={ticket.id} className="bg-white p-6 rounded-xl border border-l-4 border-l-yellow-500 border-slate-200 shadow-sm relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{ticket.type === 'escalation' ? 'Escalonamento' : ticket.type}</span>
                                                        <span className="text-xs text-slate-400">{ticket.createdAt?.toDate().toLocaleString()}</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 text-lg">Item: {ticket.targetTitle || 'Item #' + ticket.targetId}</h4>
                                                    <p className="text-sm text-slate-500">Motivo: <span className="text-slate-700 italic">"{ticket.reason}"</span></p>
                                                    <p className="text-xs text-slate-400 mt-1">Enviado por: {ticket.createdBy}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleResolveTicket(ticket.id, 'approved')} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-200 flex items-center gap-2">
                                                        <CheckCircle size={16} /> Aprovar Item
                                                    </button>
                                                    <button onClick={() => handleResolveTicket(ticket.id, 'dismissed')} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200">
                                                        Arquivar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {tickets.length === 0 && (
                                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <CheckCircle className="mx-auto mb-3 text-slate-300" size={48} />
                                            <p className="text-slate-500 font-medium">Nenhuma solicitação pendente.</p>
                                            <p className="text-slate-400 text-sm">Bom trabalho!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- AUDIT TAB --- */}
                        {activeTab === 'audit' && isMaster && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <ClipboardList className="text-indigo-600" /> Auditoria e Logs do Sistema
                                </h3>
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                            <tr>
                                                <th className="p-4">Data/Hora</th>
                                                <th className="p-4">Ação</th>
                                                <th className="p-4">Detalhes</th>
                                                <th className="p-4">Usuário</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {logs.map(log => (
                                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-500 font-mono text-xs">
                                                        {log.timestamp.toLocaleString()}
                                                    </td>
                                                    <td className="p-4 font-bold text-slate-700">
                                                        {log.action}
                                                    </td>
                                                    <td className="p-4 text-slate-600">
                                                        {log.details}
                                                    </td>
                                                    <td className="p-4 text-slate-500 text-xs">
                                                        {log.user}
                                                    </td>
                                                </tr>
                                            ))}
                                            {logs.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="p-8 text-center text-slate-400">Nenhum log registrado recentemente.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* --- ESCALATION MODAL --- */}
                        {escalationTarget && (
                            <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                                <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <AlertTriangle className="text-yellow-500" /> Escalar para Master
                                        </h3>
                                        <button onClick={() => setEscalationTarget(null)} className="text-gray-400 hover:text-gray-600">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6">
                                        <p className="text-sm text-yellow-800 font-medium">
                                            Você está enviando o item <strong>"{escalationTarget.title}"</strong> para a Torre de Controle.
                                        </p>
                                        <p className="text-xs text-yellow-700 mt-1">Este item sairá da sua lista e ficará sob responsabilidade exclusiva do Master.</p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <label className="block text-sm font-bold text-slate-700">Motivo do Escalonamento</label>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            {['Conteúdo Suspeito', 'Dúvida de Categoria', 'Denúncia de Usuário', 'Outro'].map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => setEscalationReason(r)}
                                                    className={`p-2 text-xs rounded-lg border transition-all ${escalationReason === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:border-indigo-300'}`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="w-full border p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-yellow-500 outline-none h-24 resize-none"
                                            placeholder="Descreva o motivo detalhadamente..."
                                            value={escalationReason}
                                            onChange={e => setEscalationReason(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setEscalationTarget(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                            Cancelar
                                        </button>
                                        <button onClick={confirmEscalation} className="flex-1 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors shadow-lg shadow-yellow-500/20">
                                            Confirmar Envio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

function ModerationCard({ item, onApprove, onReject, onEscalate }) {
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
                    onClick={() => onEscalate(item.type === 'Anúncio' ? 'ads' : 'campaigns', item.id, item.title)}
                    className="bg-yellow-50 text-yellow-700 p-2 rounded-lg hover:bg-yellow-100 transition-colors font-bold text-sm flex items-center gap-1"
                    title="Escalar para Master"
                >
                    <AlertTriangle size={16} />
                </button>
                <button
                    onClick={() => onReject(item.type === 'Anúncio' ? 'ads' : 'campaigns', item.id)}
                    className="bg-red-50 text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors font-bold text-sm flex items-center gap-1"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
