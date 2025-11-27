import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, Phone, MessageCircle, Star,
    Menu, X, Plus, ChevronRight, Store,
    Utensils, Wrench, ShoppingBag, HeartPulse, Filter
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, addDoc, query,
    onSnapshot, orderBy, serverTimestamp
} from 'firebase/firestore';
import {
    getAuth, signInAnonymously, onAuthStateChanged,
    signInWithCustomToken
} from 'firebase/auth';

// --- Configuração do Firebase ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Componente Principal ---
export default function InterlagosConectado() {
    const [user, setUser] = useState(null);
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showAdmin, setShowAdmin] = useState(false); // Toggle para área de cadastro

    // Categorias fixas para filtro e cadastro
    const categories = [
        { id: 'Todos', label: 'Todos', icon: <Store size={18} /> },
        { id: 'Alimentação', label: 'Alimentação', icon: <Utensils size={18} /> },
        { id: 'Serviços', label: 'Serviços', icon: <Wrench size={18} /> },
        { id: 'Comércio', label: 'Comércio', icon: <ShoppingBag size={18} /> },
        { id: 'Saúde/Beleza', label: 'Saúde & Beleza', icon: <HeartPulse size={18} /> },
    ];

    // 1. Autenticação e Carregamento de Dados
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Erro na autenticação:", error);
            }
        };
        initAuth();

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) return;

        // Acessa a coleção pública de dados
        const q = query(
            collection(db, 'artifacts', appId, 'public', 'data', 'merchants'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribeDocs = onSnapshot(q,
            (snapshot) => {
                const fetchedData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMerchants(fetchedData);
                setLoading(false);
            },
            (error) => {
                console.error("Erro ao buscar dados:", error);
                setLoading(false);
            }
        );

        return () => unsubscribeDocs();
    }, [user]);

    // 2. Filtros e Busca
    const filteredMerchants = merchants.filter(merchant => {
        const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            merchant.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || merchant.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Ordenação: Premium primeiro
    const sortedMerchants = [...filteredMerchants].sort((a, b) => {
        return (b.isPremium === true) - (a.isPremium === true);
    });

    // --- Sub-Componente: Formulário de Admin (Para você popular o app) ---
    const AdminForm = () => {
        const [formData, setFormData] = useState({
            name: '', category: 'Alimentação', description: '',
            phone: '', whatsapp: '', address: '', isPremium: false
        });
        const [submitting, setSubmitting] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!user) return;
            setSubmitting(true);

            try {
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'merchants'), {
                    ...formData,
                    createdAt: serverTimestamp(),
                    views: 0
                });
                setFormData({ name: '', category: 'Alimentação', description: '', phone: '', whatsapp: '', address: '', isPremium: false });
                alert('Comércio adicionado com sucesso!');
            } catch (err) {
                console.error(err);
                alert('Erro ao salvar.');
            } finally {
                setSubmitting(false);
            }
        };

        return (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border-2 border-indigo-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-indigo-900">Painel do Gestor (Adicionar Comércio)</h3>
                    <button onClick={() => setShowAdmin(false)} className="text-gray-500 hover:text-red-500"><X /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            required placeholder="Nome do Negócio" className="p-2 border rounded w-full"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <select
                            className="p-2 border rounded w-full"
                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.filter(c => c.id !== 'Todos').map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        placeholder="Descrição curta (ex: A melhor pizza do Interlagos)"
                        className="p-2 border rounded w-full" rows="2"
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="WhatsApp (apenas números, com DDD)" className="p-2 border rounded w-full"
                            value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        />
                        <input
                            placeholder="Endereço" className="p-2 border rounded w-full"
                            value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox" id="premium"
                            checked={formData.isPremium} onChange={e => setFormData({ ...formData, isPremium: e.target.checked })}
                        />
                        <label htmlFor="premium" className="text-sm font-semibold text-amber-600">Este é um cliente Premium (Destaque)?</label>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 font-bold">
                        {submitting ? 'Salvando...' : 'Cadastrar no Guia'}
                    </button>
                </form>
            </div>
        );
    };

    // --- Renderização Principal ---
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

            {/* Header Fixo */}
            <header className="sticky top-0 z-50 bg-indigo-700 text-white shadow-md">
                <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MapPin className="text-yellow-400" size={24} />
                        <div>
                            <h1 className="font-bold text-lg leading-none">Interlagos</h1>
                            <span className="text-xs text-indigo-200">Guia Conectado</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAdmin(!showAdmin)}
                        className="text-xs bg-indigo-800 p-2 rounded hover:bg-indigo-600 border border-indigo-500"
                    >
                        {showAdmin ? 'Fechar Admin' : 'Gestor'}
                    </button>
                </div>

                {/* Barra de Busca */}
                <div className="max-w-4xl mx-auto px-4 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="O que você procura hoje? (ex: Pizza, Pedreiro)"
                            className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="max-w-4xl mx-auto px-4 py-6">

                {/* Área Administrativa (Condicional) */}
                {showAdmin && <AdminForm />}

                {/* Filtros de Categoria */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${selectedCategory === cat.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Status de Loading e Vazio */}
                {loading && (
                    <div className="text-center py-10 text-gray-500">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-indigo-600 rounded-full" role="status"></div>
                        <p className="mt-2">Carregando o melhor do bairro...</p>
                    </div>
                )}

                {!loading && sortedMerchants.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                        <Store size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">Nenhum comércio encontrado nesta categoria.</p>
                        {showAdmin && <p className="text-sm text-indigo-600 mt-2">Use o painel acima para cadastrar!</p>}
                    </div>
                )}

                {/* Lista de Comerciantes */}
                <div className="space-y-4">
                    {sortedMerchants.map((merchant) => (
                        <div
                            key={merchant.id}
                            className={`bg-white rounded-xl overflow-hidden transition-all duration-200 
                ${merchant.isPremium
                                    ? 'shadow-lg border-l-4 border-yellow-400 ring-1 ring-yellow-400/20'
                                    : 'shadow-sm border border-gray-100 hover:shadow-md'}`}
                        >
                            <div className="p-4 flex gap-4">
                                {/* Imagem / Placeholder */}
                                <div className={`w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center
                  ${merchant.isPremium ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {/* Se tivesse upload de imagem real, a tag img iria aqui */}
                                    <Store size={32} />
                                </div>

                                {/* Info do Comércio */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1">
                                                {merchant.name}
                                                {merchant.isPremium && <Star size={14} className="fill-yellow-400 text-yellow-400" />}
                                            </h3>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                {merchant.category}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {merchant.description || 'Entre em contato para saber mais.'}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                        {merchant.whatsapp ? (
                                            <a
                                                href={`https://wa.me/55${merchant.whatsapp.replace(/\D/g, '')}?text=Olá, vi sua empresa no Guia Interlagos Conectado!`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                                            >
                                                <MessageCircle size={16} />
                                                Pedir no Zap
                                            </a>
                                        ) : (
                                            <button disabled className="flex-1 bg-gray-200 text-gray-500 text-sm font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                                                <MessageCircle size={16} />
                                                Sem WhatsApp
                                            </button>
                                        )}

                                        {merchant.address && (
                                            <div className="flex items-center text-xs text-gray-500 gap-1 sm:max-w-[50%]">
                                                <MapPin size={14} />
                                                <span className="truncate">{merchant.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Rodapé Premium */}
                            {merchant.isPremium && (
                                <div className="bg-yellow-50 px-4 py-1.5 flex justify-between items-center text-xs border-t border-yellow-100">
                                    <span className="text-yellow-700 font-medium flex items-center gap-1">
                                        <Star size={12} className="fill-yellow-600" /> Parceiro Verificado
                                    </span>
                                    <span className="text-yellow-600">Prioridade na busca</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer Simples */}
            <footer className="bg-white border-t mt-8 py-6 text-center text-gray-500 text-sm">
                <p>© 2025 Guia Parque Interlagos.</p>
                <p className="text-xs mt-1">Desenvolvido localmente.</p>
            </footer>
        </div>
    );
}