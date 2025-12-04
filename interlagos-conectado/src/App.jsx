import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebaseConfig';
import Sidebar from './Sidebar';
import MerchantDetailModal from './MerchantDetailModal';
import AdDetailModal from './AdDetailModal';
import NewsDetailModal from './NewsDetailModal';
import ServiceDetailModal from './ServiceDetailModal';
import CampaignDetailModal from './CampaignDetailModal';
import LoginModal from './LoginModal';
import UserProfile from './UserProfile';
import CreateAdWizard from './CreateAdWizard';
import AdminPanel from './AdminPanel';
import Seeder from './Seeder';
import NewsFeed from './NewsFeed';
import AdsView from './AdsView';
import DonationsView from './DonationsView';
import UtilityView from './UtilityView';
import HistoryView from './HistoryView';
import SuggestionsView from './SuggestionsView';
import ManagementView from './ManagementView';
import PlansView from './PlansView';
import MerchantLandingView from './MerchantLandingView';
import ChatbotWidget from './components/ChatbotWidget';
import { ChatContextProvider } from './context/ChatContext';
import { Menu, Search, Filter, User, LogOut, PlusCircle, MoreHorizontal, Utensils, ShoppingBag, Stethoscope, Hammer, Car, Scissors, GraduationCap, Dog } from 'lucide-react';

const categories = [
  { id: 'Todos', label: 'Todos', icon: <Filter size={20} /> },
  { id: 'Restaurantes', label: 'Restaurantes', icon: <Utensils size={20} /> },
  { id: 'Serviços', label: 'Serviços', icon: <Filter size={20} /> },
  { id: 'Lojas', label: 'Lojas', icon: <ShoppingBag size={20} /> },
  { id: 'Saúde', label: 'Saúde', icon: <Stethoscope size={20} /> },
  { id: 'Pet', label: 'Pet & Vet', icon: <Dog size={20} /> },
  { id: 'Construção', label: 'Construção', icon: <Hammer size={20} /> },
  { id: 'Automotivo', label: 'Automotivo', icon: <Car size={20} /> },
  { id: 'Beleza', label: 'Beleza', icon: <Scissors size={20} /> },
  { id: 'Educação', label: 'Educação', icon: <GraduationCap size={20} /> },
  { id: 'Outros', label: 'Outros', icon: <MoreHorizontal size={20} /> }
];

export default function App() {
  const [currentView, setCurrentView] = useState('merchants');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Carregar comerciantes do Firestore em tempo real
  useEffect(() => {
    if (!db) {
      console.warn("Firestore (db) não inicializado. Pulando carregamento de comerciantes.");
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'merchants'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const merchantsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMerchants(merchantsData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar comerciantes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Monitorar estado de autenticação
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Mock Data for Merchants (moved from internal state to top level or imported)
  const mockMerchants = [
    { id: 'mock1', name: 'Padaria do Bairro', category: 'Restaurantes', rating: 4.8, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500', description: 'A melhor padaria da região com pães fresquinhos.' },
    { id: 'mock2', name: 'Farmácia Central', category: 'Saúde', rating: 4.5, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=500', description: 'Medicamentos e produtos de higiene com atendimento de qualidade.' },
    { id: 'mock3', name: 'Oficina Mecânica', category: 'Serviços', rating: 4.9, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=500', description: 'Serviços automotivos completos para seu veículo.' },
    { id: 'mock4', name: 'Loja de Roupas Chic', category: 'Lojas', rating: 4.2, image: 'https://images.unsplash.com/photo-1523381294911-8d3cead1858b?auto=format&fit=crop&q=80&w=500', description: 'As últimas tendências da moda para todas as idades.' },
    { id: 'mock5', name: 'Restaurante Sabor Caseiro', category: 'Restaurantes', rating: 4.7, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500', description: 'Comida caseira deliciosa e ambiente acolhedor.' },
    { id: 'mock6', name: 'Pet Shop Amigo Fiel', category: 'Pet', rating: 4.6, image: 'https://images.unsplash.com/photo-1583511655856-3ce830668271?auto=format&fit=crop&q=80&w=500', description: 'Tudo para o seu pet, de ração a banho e tosa.' },
    { id: 'mock7', name: 'Salão de Beleza Divas', category: 'Beleza', rating: 4.3, image: 'https://images.unsplash.com/photo-1599305445671-ac291c9a87d6?auto=format&fit=crop&q=80&w=500', description: 'Cortes, coloração e tratamentos para o seu cabelo.' },
    { id: 'mock8', name: 'Livraria Conhecimento', category: 'Lojas', rating: 4.9, image: 'https://images.unsplash.com/photo-1532012197247-fee6a2ed53b0?auto=format&fit=crop&q=80&w=500', description: 'Um universo de livros para todas as idades e gostos.' },
    { id: 'mock9', name: 'Academia Corpo Ativo', category: 'Saúde', rating: 4.4, image: 'https://images.unsplash.com/photo-1571019625454-f112b322f987?auto=format&fit=crop&q=80&w=500', description: 'Treinos personalizados e equipamentos modernos.' },
    { id: 'mock10', name: 'Floricultura Jardim Encantado', category: 'Outros', rating: 4.8, image: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?auto=format&fit=crop&q=80&w=500', description: 'Flores frescas e arranjos para todas as ocasiões.' },
  ];

  const filteredMerchants = (merchants.length > 0 ? merchants : mockMerchants).filter(merchant => {
    const matchesCategory = selectedCategory === 'Todos' || merchant.category === selectedCategory;
    const matchesSearch = merchant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMerchantClick = (merchant) => {
    setSelectedMerchant(merchant);
  };

  if (showCreateAd) {
    return <CreateAdWizard onBack={() => setShowCreateAd(false)} />;
  }

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  return (
    <ChatContextProvider>
      <div className="dark">
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">

          {/* Mobile Header */}
          <header className="lg:hidden bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                <span className="font-bold text-white text-lg tracking-tight">IC</span>
              </div>
              <h1 className="font-bold text-lg text-white">
                Interlagos
              </h1>
            </div>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors relative group"
            >
              {user ? (
                user.photoURL ?
                  <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-indigo-500" />
                  : <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">{user.displayName?.[0] || 'U'}</div>
              ) : (
                <User className="text-slate-400 group-hover:text-white transition-colors" size={24} />
              )}
            </button>
          </header>

          <div className="flex">
            {/* Sidebar (Desktop) */}
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleAdminClick={() => setShowAdmin(true)}
              className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl"
            />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full pb-24 lg:pb-8">

              {/* Desktop Header & Search */}
              <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 p-4 lg:p-6 mb-6 lg:mb-8 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-6xl mx-auto">

                  {/* Search Bar */}
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300" size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="O que você procura hoje?"
                      className="w-full bg-slate-800/50 border border-white/5 text-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-800 transition-all duration-300 placeholder:text-slate-500 shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Desktop User Actions */}
                  <div className="hidden lg:flex items-center gap-3">
                    {user ? (
                      <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 pr-4 rounded-full border border-white/5 hover:border-white/10 transition-all">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full border border-indigo-500/30" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                            {user.displayName?.[0] || 'U'}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-medium">Olá,</span>
                          <span className="text-sm font-bold text-slate-200 leading-none">{user.displayName?.split(' ')[0]}</span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="ml-2 p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-colors"
                          title="Sair"
                        >
                          <LogOut size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsLoginOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95"
                      >
                        <User size={20} />
                        <span>Entrar</span>
                      </button>
                    )}

                    {/* Admin Toggle (Dev only) */}
                    <button
                      onClick={() => setShowAdmin(true)}
                      className="p-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-xl border border-white/5 transition-all"
                      title="Painel Admin"
                    >
                      <Filter size={20} />
                    </button>
                  </div>
                </div>

                {/* Mobile Categories (Horizontal Scroll) */}
                <div className="lg:hidden mt-4 -mx-4 px-4 overflow-x-auto pb-2 scrollbar-hide flex gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-800/50 text-slate-400 border border-white/5'
                        }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 lg:px-6 max-w-6xl mx-auto space-y-8">

                {/* Dynamic Content View */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {currentView === 'merchants' && (
                    <>
                      {/* Categories Tabs (Moved from Sidebar) */}
                      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat.id
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                              : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:bg-slate-800'
                              }`}
                          >
                            {cat.icon}
                            {cat.label}
                          </button>
                        ))}
                      </div>
                      {/* Featured Merchants (Premium) */}
                      {selectedCategory === 'Todos' && !searchTerm && (
                        <section className="mb-12">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                              <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                              Destaques da Região
                            </h2>
                          </div>
                          {/* TODO: Implement PremiumCarousel */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Placeholder for Premium Merchants */}
                            {merchants.filter(m => m.isPremium).slice(0, 3).map(merchant => (
                              <div key={merchant.id} onClick={() => handleMerchantClick(merchant)} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-slate-800 transition-all">
                                <div className="h-40 bg-slate-700 rounded-xl mb-4 overflow-hidden">
                                  <img src={merchant.image || `https://source.unsplash.com/random/800x600/?store,${merchant.category}`} alt={merchant.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg">{merchant.name}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2">{merchant.description}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* All Merchants Grid */}
                      <section>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                          <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                          {searchTerm ? `Resultados para "${searchTerm}"` : `${selectedCategory}`}
                        </h2>

                        {loading ? (
                          <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMerchants.map(merchant => (
                              <div
                                key={merchant.id}
                                onClick={() => handleMerchantClick(merchant)}
                                className="group bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                              >
                                <div className="aspect-video bg-slate-700/50 rounded-xl mb-4 overflow-hidden relative">
                                  <img
                                    src={merchant.image || `https://source.unsplash.com/random/400x300/?${merchant.category}`}
                                    alt={merchant.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium text-white border border-white/10">
                                    {merchant.category}
                                  </div>
                                </div>
                                <h3 className="font-bold text-lg text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors">{merchant.name}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{merchant.description}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Aberto agora
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {!loading && filteredMerchants.length === 0 && (
                          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-white/5 border-dashed">
                            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Search className="text-slate-500" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Nenhum resultado encontrado</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                              Não encontramos nada para "{searchTerm}" na categoria {selectedCategory}.
                              Tente buscar por outro termo.
                            </p>
                          </div>
                        )}
                      </section>
                    </>
                  )}

                  {currentView === 'news' && (
                    <NewsFeed user={user} />
                  )}

                  {currentView === 'ads' && (
                    <AdsView user={user} onAdClick={setSelectedAd} />
                  )}

                  {currentView === 'donations' && (
                    <DonationsView user={user} onCampaignClick={setSelectedCampaign} />
                  )}

                  {currentView === 'utility' && (
                    <UtilityView onServiceClick={setSelectedService} />
                  )}

                  {currentView === 'history' && (
                    <HistoryView />
                  )}

                  {currentView === 'suggestions' && (
                    <SuggestionsView />
                  )}

                  {currentView === 'management' && (
                    <ManagementView />
                  )}

                  {currentView === 'plans' && (
                    <PlansView />
                  )}

                  {currentView === 'merchant-landing' && (
                    <MerchantLandingView onRegisterClick={() => setCurrentView('plans')} />
                  )}

                </div>
              </div>
            </main>
          </div>

          {/* Floating Action Button (Mobile) */}
          <button
            onClick={() => setShowCreateAd(true)}
            className="lg:hidden fixed bottom-20 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-90 z-30"
          >
            <PlusCircle size={24} />
          </button>

          {/* Modals */}
          {selectedMerchant && (
            <MerchantDetailModal
              merchant={selectedMerchant}
              onClose={() => setSelectedMerchant(null)}
            />
          )}

          {isLoginOpen && (
            <LoginModal
              onClose={() => setIsLoginOpen(false)}
              onSuccess={(user) => {
                setUser(user);
                setIsLoginOpen(false);
              }}
            />
          )}

          {selectedAd && (
            <AdDetailModal
              ad={selectedAd}
              onClose={() => setSelectedAd(null)}
            />
          )}

          {selectedNews && (
            <NewsDetailModal
              news={selectedNews}
              onClose={() => setSelectedNews(null)}
            />
          )}

          {selectedService && (
            <ServiceDetailModal
              service={selectedService}
              onClose={() => setSelectedService(null)}
            />
          )}

          {selectedCampaign && (
            <CampaignDetailModal
              campaign={selectedCampaign}
              onClose={() => setSelectedCampaign(null)}
            />
          )}

          {/* Chatbot Widget */}
          <ChatbotWidget />

        </div>
      </div>
    </ChatContextProvider>
  );
}
