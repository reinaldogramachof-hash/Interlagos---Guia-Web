import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Phone, MessageCircle, Star,
  Menu, X, Plus, ChevronRight, Store,
  Utensils, Wrench, ShoppingBag, HeartPulse, Heart, Newspaper, Download, LifeBuoy,
  Car, GraduationCap, Dog, Zap, ShieldCheck, LogIn, Settings
} from 'lucide-react';

// Importações do Firebase SDK
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// IMPORTANTE: Importar do seu arquivo de configuração local
import { db, auth } from './firebaseConfig';
import LoginPage from './LoginPage';
import Seeder from './Seeder';
import PremiumCarousel from './PremiumCarousel';
import SuperPremiumCarousel from './SuperPremiumCarousel';
import AdminPanel from './AdminPanel';
import NewsFeed from './NewsFeed';
import UtilityView from './UtilityView';
import AdsView from './AdsView';
import DonationsView from './DonationsView';
import Sidebar from './Sidebar';
import LoginModal from './LoginModal';
import UserProfile from './UserProfile';
import { mockData } from './mockData';
import { registerInstallPrompt, installApp, isInstallAvailable } from './pwaUtils';

// Variável de App ID
const appId = 'interlagos-v1';

const navItems = [
  { id: 'merchants', label: 'Comércio', icon: <Store size={18} /> },
  { id: 'ads', label: 'Anúncios', icon: <ShoppingBag size={18} /> },
  { id: 'news', label: 'Notícias', icon: <Newspaper size={18} /> },
  { id: 'donations', label: 'Doações', icon: <Heart size={18} /> },
  { id: 'utility', label: 'Utilidade', icon: <LifeBuoy size={18} /> },
];

// CATEGORIAS ATUALIZADAS BASEADO NO RELATÓRIO DE INTELIGÊNCIA
const categories = [
  { id: 'Todos', label: 'Todos', icon: <Store size={18} /> },
  { id: 'Alimentação', label: 'Alimentação & Delivery', icon: <Utensils size={18} /> },
  { id: 'Automotivo', label: 'Auto & Mecânica', icon: <Car size={18} /> }, // Novo: Cinturão Mecânico
  { id: 'Saúde', label: 'Saúde & Bem-estar', icon: <HeartPulse size={18} /> }, // Novo: Clínicas/Academias
  { id: 'Pet', label: 'Pet & Vet', icon: <Dog size={18} /> }, // Novo: Lima Pet Shop e afins
  { id: 'Serviços', label: 'Serviços Gerais', icon: <Zap size={18} /> }, // Gás, Reparos
  { id: 'Educação', label: 'Educação', icon: <GraduationCap size={18} /> }, // Novo: Escolas (CESC)
  { id: 'Comércio', label: 'Lojas & Varejo', icon: <ShoppingBag size={18} /> },
];

export default function App() {
  // MOCK AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mockUserRole, setMockUserRole] = useState(null); // 'admin' or 'user'

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Novo estado para controle de role
  const [showLoginModal, setShowLoginModal] = useState(false); // Controle do modal de login

  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('merchants');

  const handleMockLogin = (role) => {
    setIsAuthenticated(true);
    setMockUserRole(role);
    setIsAdmin(role === 'admin');

    // Mock User Object for compatibility
    setUser({
      uid: 'mock-uid',
      displayName: role === 'admin' ? 'Administrador' : 'Morador',
      email: role === 'admin' ? 'admin@interlagos.com' : 'morador@interlagos.com',
      photoURL: null
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMockUserRole(null);
    setUser(null);
    setIsAdmin(false);
    setShowAdmin(false);
  };


  // Função para verificar/criar usuário no Firestore e obter role
  const checkUserRole = async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false);
      setShowAdmin(false); // Garante que o painel feche ao deslogar
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Usuário já existe, verifica se é admin
      const userData = userSnap.data();
      setIsAdmin(userData.role === 'admin');
    } else {
      // Novo usuário, cria registro básico
      // AUTO-PROMOÇÃO: Se for o email do dono, já cria como admin
      const isOwner = currentUser.email === 'reinaldogramachof@gmail.com';

      await setDoc(userRef, {
        email: currentUser.email,
        name: currentUser.displayName || currentUser.email.split('@')[0], // Fallback para nome se não tiver (email login)
        photoURL: currentUser.photoURL,
        role: isOwner ? 'admin' : 'user',
        createdAt: serverTimestamp()
      });
      setIsAdmin(isOwner);
    }
  };

  // Override handleAdminClick for Mock Mode
  const handleAdminClick = async () => {
    if (mockUserRole === 'admin') {
      setShowAdmin(!showAdmin);
    } else {
      alert("Acesso negado. Você está logado como Morador.");
    }
  };

  // 1. Autenticação e Carregamento de Dados
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      checkUserRole(currentUser);
    });

    // PWA Install Prompt Listener
    registerInstallPrompt();

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // Escuta em tempo real a coleção de comerciantes
    // Nota: Em produção local, certifique-se que suas regras do Firestore permitem leitura
    const q = query(
      collection(db, 'merchants'), // Nome da coleção simplificado para uso local
      orderBy('createdAt', 'desc')
    );

    const unsubscribeDocs = onSnapshot(q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (fetchedData.length === 0) {
          setMerchants(mockData);
        } else {
          setMerchants(fetchedData);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao buscar dados (verifique suas regras do Firestore):", error);
        setLoading(false);
      }
    );

    return () => unsubscribeDocs();
  }, [user]);

  // 2. Filtros e Busca Inteligente
  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || merchant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Função de Analytics: Rastrear Cliques
  const handleTrackClick = async (merchantId) => {
    try {
      const merchantRef = doc(db, 'merchants', merchantId);
      // Incrementa o contador de views/cliques atomicamente
      await updateDoc(merchantRef, {
        clicks: increment(1)
      });
      console.log(`Clique registrado para: ${merchantId}`);
    } catch (error) {
      console.error("Erro ao registrar clique:", error);
    }
  };

  // Ordenação: Premium primeiro
  const sortedMerchants = [...filteredMerchants].sort((a, b) => {
    return (b.isPremium === true) - (a.isPremium === true);
  });

  // --- Renderização Principal ---
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleMockLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 pb-20">

      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-indigo-700 text-white shadow-lg shadow-indigo-900/20">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 min-w-fit">
            <div className="bg-white/10 p-2 rounded-lg">
              <MapPin className="text-yellow-400" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">Interlagos</h1>
              <span className="text-xs text-indigo-200 font-medium">Guia Oficial do Bairro</span>
            </div>
          </div>

          {/* Barra de Busca (Desktop: Centralizada e Larga) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-3 text-indigo-300 group-focus-within:text-white transition-colors" size={18} />
              <input
                type="text"
                placeholder="O que você procura? (ex: Mecânica, Pizza, Gás)"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-white border-none outline-none ring-1 ring-indigo-500/30 focus:ring-yellow-400 bg-indigo-800/50 placeholder-indigo-300 shadow-inner transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-indigo-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Área do Usuário (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isInstallAvailable && (
              <button
                onClick={installApp}
                className="flex items-center gap-2 text-xs bg-indigo-800/50 p-2 rounded-lg hover:bg-indigo-600 border border-indigo-500/30 transition-colors backdrop-blur-sm whitespace-nowrap text-indigo-100"
              >
                <Download size={14} /> App
              </button>
            )}

            {user ? (
              <UserProfile user={user} isAdmin={isAdmin} onLogout={handleLogout} />
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm"
              >
                Entrar
              </button>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className={`p-2 rounded-full transition-colors ${showAdmin ? 'bg-yellow-400 text-indigo-900' : 'text-indigo-200 hover:bg-white/10'}`}
              title="Menu Admin"
            >
              <Settings size={24} />
            </button>
          )}
        </div>

        {/* Barra de Busca (Mobile Only) */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-3 text-indigo-300 group-focus-within:text-white transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar no bairro..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-white border-none outline-none ring-1 ring-indigo-500/30 focus:ring-yellow-400 bg-indigo-800/50 placeholder-indigo-300 shadow-inner transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-indigo-300 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex items-start gap-6 px-4 py-6">

        {/* Sidebar (Desktop Only) */}
        <Sidebar
          currentView={currentView}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleAdminClick={handleAdminClick} // Passando a nova função com lógica de auth
          isAdmin={isAdmin} // Passando estado de admin
          user={user} // Passando usuário
          onLogin={() => setShowLoginModal(true)} // Ação de login
        />

        {/* Conteúdo Principal */}
        <main className="flex-1 min-w-0">
          {/* Conteúdo Principal */}
          <main className="flex-1 min-w-0">
            {/* Navigation Tabs (Mobile & Desktop) */}
            <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40 mb-6 shadow-sm">
              <div className="flex overflow-x-auto scrollbar-hide">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex-1 min-w-[100px] py-4 flex flex-col items-center justify-center gap-1 text-sm font-medium border-b-2 transition-colors
                      ${currentView === item.id
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Painel do Gestor */}
            {showAdmin && (
              <AdminPanel
                merchants={merchants}
                categories={categories}
                onClose={() => setShowAdmin(false)}
              />
            )}

            {/* VIEW: COMÉRCIO (HOME) */}
            {currentView === 'merchants' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Categorias (Mobile/Tablet Only) */}
                <div className="lg:hidden mb-6">
                  <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex flex-col items-center justify-center min-w-[80px] h-20 p-2 rounded-2xl text-[10px] font-bold transition-all snap-start border shadow-sm
                          ${selectedCategory === cat.id
                            ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-indigo-200'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50'}`}
                      >
                        <div className={`mb-1.5 p-2 rounded-full ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-50'}`}>
                          {cat.icon}
                        </div>
                        <span className="text-center leading-tight">{cat.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SEÇÃO 0: SUPER DESTAQUES (SUPER PREMIUM) */}
                {!loading && filteredMerchants.some(m => m.plan === 'super') && (
                  <SuperPremiumCarousel
                    merchants={filteredMerchants.filter(m => m.plan === 'super')}
                    categories={categories}
                  />
                )}

                {/* SEÇÃO 1: CARROSSEL DE DESTAQUES (PREMIUM) */}
                {!loading && filteredMerchants.some(m => m.plan === 'premium' || (m.isPremium && m.plan !== 'super')) && (
                  <PremiumCarousel
                    merchants={filteredMerchants.filter(m => m.plan === 'premium' || (m.isPremium && m.plan !== 'super'))}
                    categories={categories}
                  />
                )}

                {/* Título da Seção */}
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:bg-transparent lg:shadow-none lg:border-none lg:p-0">
                  <div>
                    <h2 className="font-bold text-gray-800 text-xl">
                      {selectedCategory === 'Todos' ? 'Destaques do Bairro' : categories.find(c => c.id === selectedCategory)?.label}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 hidden lg:block">Encontre os melhores serviços e comércios avaliados da região.</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium border border-gray-200">
                    {sortedMerchants.length} locais
                  </span>
                </div>

                {/* Loading e Estados Vazios */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-sm font-medium">Carregando o melhor do bairro...</p>
                  </div>
                )}

                {!loading && filteredMerchants.length === 0 && (
                  <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 max-w-lg mx-auto">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Store size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-gray-800 font-bold text-lg mb-1">Nenhum local encontrado</h3>
                    <p className="text-gray-500 text-sm mb-6">Não encontramos comércios nesta categoria ainda.</p>
                    {showAdmin && (
                      <button onClick={() => setShowAdmin(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                        Cadastrar o Primeiro
                      </button>
                    )}
                  </div>
                )}

                {/* SEÇÃO 2: FEED (LISTA DUPLA - BASIC) */}
                {!loading && filteredMerchants.some(m => !m.isPremium || m.plan === 'basic') && (
                  <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <Store className="text-indigo-600" size={20} />
                      <h2 className="font-bold text-gray-800 text-xl">Explorar Bairro</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredMerchants.filter(m => (!m.isPremium || m.plan === 'basic') && m.plan !== 'super' && m.plan !== 'premium').map((merchant) => (
                        <div
                          key={merchant.id}
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-4 items-start"
                        >
                          <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-lg bg-gray-50 text-gray-400">
                            {categories.find(c => c.id === merchant.category)?.icon || <Store />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-gray-900 text-base truncate">
                                {merchant.name}
                              </h3>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                {merchant.category}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-2">
                              {merchant.description}
                            </p>

                            <div className="flex items-center gap-3">
                              {merchant.whatsapp && (
                                <a
                                  href={`https://wa.me/55${merchant.whatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleTrackClick(merchant.id)}
                                  className="text-green-600 text-xs font-bold flex items-center gap-1 hover:underline"
                                >
                                  <MessageCircle size={12} />
                                  Chamar no Zap
                                </a>
                              )}
                              {merchant.address && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 truncate max-w-[150px]">
                                  <MapPin size={10} />
                                  {merchant.address}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* VIEW: ANÚNCIOS */}
            {currentView === 'ads' && <AdsView />}

            {/* VIEW: NOTÍCIAS */}
            {currentView === 'news' && (
              <div className="p-4">
                <NewsFeed />
              </div>
            )}

            {/* VIEW: DOAÇÕES */}
            {currentView === 'donations' && <DonationsView />}

            {/* VIEW: UTILIDADE */}
            {currentView === 'utility' && <UtilityView />}
          </main>
        </main>
      </div>

      {/* Footer Mobile Padding */}
      <div className="h-10 lg:hidden"></div>
      {/* Modal de Login */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={(user) => {
            console.log("Logado com sucesso:", user.email);
            // O estado 'user' será atualizado automaticamente pelo onAuthStateChanged
          }}
        />
      )}
    </div>
  );
}
