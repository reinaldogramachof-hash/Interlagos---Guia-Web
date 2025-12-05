import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './Sidebar';
import MerchantDetailModal from './MerchantDetailModal';
import AdDetailModal from './AdDetailModal';
import NewsDetailModal from './NewsDetailModal';
import ServiceDetailModal from './ServiceDetailModal';
import CampaignDetailModal from './CampaignDetailModal';
import LoginModal from './LoginModal';
import CreateAdWizard from './CreateAdWizard';
import AdminPanel from './AdminPanel';
import MerchantPanel from './panels/MerchantPanel';
import ResidentPanel from './panels/ResidentPanel';
import NewsFeed from './NewsFeed';
import AdsView from './AdsView';
import DonationsView from './DonationsView';
import UtilityView from './UtilityView';
import HistoryView from './HistoryView';
import SuggestionsView from './SuggestionsView';
import ManagementView from './ManagementView';
import PlansView from './PlansView';
import MerchantLandingView from './MerchantLandingView';
import NotificationBell from './components/NotificationBell';
import { Search, User, LogOut, PlusCircle, LayoutDashboard, Store, UserCircle, ChevronDown, ChevronLeft, ChevronRight, Trophy, Star, CircleDashed } from 'lucide-react';
import { categories } from './constants/categories';

function AppContent() {
  const { currentUser, logout, isAdmin, isMaster, isMerchant } = useAuth();
  const [currentView, setCurrentView] = useState('merchants');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Carousel Refs and Auto-Scroll State
  const premiumCarouselRef = useRef(null);
  const proCarouselRef = useRef(null);
  const [isPremiumPaused, setIsPremiumPaused] = useState(false);
  const [isProPaused, setIsProPaused] = useState(false);

  // Infinite Lists Configuration
  // Note: merchants array changes on load. We need these derived arrays to be robust.
  const premiumMerchants = merchants.filter(m => m.plan === 'premium').sort((a, b) => (a.plan === 'premium' ? -1 : 1));
  const proMerchants = merchants.filter(m => m.plan === 'professional');

  // Duplicate for seamless looping (6x for safety)
  const infinitePremium = [...premiumMerchants, ...premiumMerchants, ...premiumMerchants, ...premiumMerchants, ...premiumMerchants, ...premiumMerchants].slice(0, 30);
  // Pro: For CSS Marquee, we just need enough duplicate content to fill the screen + buffer.
  const infinitePro = [...proMerchants, ...proMerchants, ...proMerchants, ...proMerchants, ...proMerchants, ...proMerchants, ...proMerchants, ...proMerchants, ...proMerchants, ...proMerchants];

  // Auto-scroll contínuo para Premium (velocidade moderada)
  useEffect(() => {
    let animationFrameId;
    const scroll = () => {
      if (!isPremiumPaused && premiumCarouselRef.current) {
        const scroller = premiumCarouselRef.current;
        // Loop infinito: reseta quando passa da metade
        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft = scroller.scrollLeft - (scroller.scrollWidth / 2);
        } else {
          // Scroll contínuo suave
          scroller.scrollLeft += 0.5;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPremiumPaused]);

  // Auto-scroll contínuo para Pro (velocidade igual ao Premium para consistência)
  useEffect(() => {
    let animationFrameId;
    const scroll = () => {
      if (!isProPaused && proCarouselRef.current) {
        const scroller = proCarouselRef.current;
        // Loop infinito: reseta quando passa da metade
        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft = scroller.scrollLeft - (scroller.scrollWidth / 2);
        } else {
          // Scroll contínuo suave (mesma velocidade do Premium)
          scroller.scrollLeft += 0.5;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isProPaused]);

  // Handle manual scroll reset for Premium to ensure it never "ends" (infinite loop)
  const handlePremiumScroll = () => {
    if (!premiumCarouselRef.current) return;
    const scroller = premiumCarouselRef.current;
    const maxScroll = scroller.scrollWidth / 2;

    // Se passou da metade, reseta invisivelmente para o início
    if (scroller.scrollLeft >= maxScroll - 10) {
      scroller.scrollLeft = scroller.scrollLeft - maxScroll;
    }
  };

  // Handle manual scroll reset for Pro (same logic as Premium)
  const handleProScroll = () => {
    if (!proCarouselRef.current) return;
    const scroller = proCarouselRef.current;
    const maxScroll = scroller.scrollWidth / 2;

    // Se passou da metade, reseta invisivelmente para o início
    if (scroller.scrollLeft >= maxScroll - 10) {
      scroller.scrollLeft = scroller.scrollLeft - maxScroll;
    }
  };

  // Carregar comerciantes do Firestore em tempo real
  useEffect(() => {
    if (!db) {
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

  // Filtragem e Ordenação de comerciantes
  const filteredMerchants = merchants
    .filter(merchant => {
      const matchesCategory = selectedCategory === 'Todos' || merchant.category === selectedCategory;
      const matchesSearch = merchant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const planPriority = { 'premium': 4, 'professional': 3, 'basic': 2, 'free': 1 };
      const priorityA = planPriority[a.plan] || (a.isPremium ? 4 : 2); // Fallback for old data
      const priorityB = planPriority[b.plan] || (b.isPremium ? 4 : 2);

      return priorityB - priorityA; // Descending order
    });

  const handleMerchantClick = (merchant) => {
    setSelectedMerchant(merchant);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setCurrentView('merchants');
  };

  if (showCreateAd) {
    return <CreateAdWizard onClose={() => setShowCreateAd(false)} user={currentUser} isOpen={true} />;
  }

  // Renderização condicional das views principais
  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminPanel onClose={() => setCurrentView('merchants')} />;
      case 'merchant-panel':
        return <MerchantPanel />;
      case 'resident-panel':
        return <ResidentPanel />;
      case 'news':
        return <NewsFeed />;
      case 'ads':
        return <AdsView />;
      case 'donations':
        return <DonationsView />;
      case 'utility':
        return <UtilityView onServiceClick={setSelectedService} />;
      case 'history':
        return <HistoryView />;
      case 'suggestions':
        return <SuggestionsView />;
      case 'management':
        return <ManagementView />;
      case 'plans':
        return <PlansView />;
      case 'merchant-landing':
        return <MerchantLandingView onRegisterClick={() => setCurrentView('plans')} />;
      case 'merchants':
      default:
        return (
          <>
            {/* Categories Tabs */}
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

            {/* Premium Highlights Carousel (2 cards) */}
            {selectedCategory === 'Todos' && !searchTerm && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Destaques Premium
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onMouseEnter={() => setIsPremiumPaused(true)}
                      onMouseLeave={() => setIsPremiumPaused(false)}
                      onClick={() => premiumCarouselRef.current?.scrollBy({ left: -premiumCarouselRef.current.clientWidth, behavior: 'smooth' })}
                      className="p-2 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700 hover:border-amber-500/50 transition-all text-slate-400 hover:text-amber-400"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onMouseEnter={() => setIsPremiumPaused(true)}
                      onMouseLeave={() => setIsPremiumPaused(false)}
                      onClick={() => premiumCarouselRef.current?.scrollBy({ left: premiumCarouselRef.current.clientWidth, behavior: 'smooth' })}
                      className="p-2 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700 hover:border-amber-500/50 transition-all text-slate-400 hover:text-amber-400"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                {/* Simple manual carousel implementation for 2 cards */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsPremiumPaused(true)}
                  onMouseLeave={() => setIsPremiumPaused(false)}
                >
                  <div
                    ref={premiumCarouselRef}
                    id="premium-carousel"
                    onScroll={handlePremiumScroll}
                    className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
                    style={{ scrollBehavior: 'auto' }}
                  >
                    {infinitePremium.map((merchant, index) => (
                      <div
                        key={`${merchant.id}-${index}`}
                        onClick={() => handleMerchantClick(merchant)}
                        className="premium-card min-w-[85%] md:min-w-[48%] bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-amber-500/20 transition-all relative overflow-hidden group/card"
                      >
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-xs uppercase font-black px-4 py-1.5 rounded-bl-2xl shadow-lg z-10 flex items-center gap-1">
                          Premium <Trophy size={12} className="fill-white" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/2 h-48 md:h-full bg-slate-700 rounded-2xl overflow-hidden shadow-inner">
                            <img src={merchant.image || `https://source.unsplash.com/random/800x600/?store,${merchant.category}`} alt={merchant.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold mb-3 w-fit">{merchant.category}</span>
                            <h3 className="font-bold text-2xl text-white mb-2">{merchant.name}</h3>
                            <p className="text-slate-400 text-sm line-clamp-3 mb-4">{merchant.description}</p>
                            <div className="mt-auto flex items-center gap-2 text-amber-400 text-xs font-bold">
                              VEJA MAIS DETALHES <div className="p-1 bg-amber-500/20 rounded-full"><ChevronRight size={12} /></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Professional Highlights Carousel (3-4 cards) */}
            {selectedCategory === 'Todos' && !searchTerm && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                    Destaques Pro
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onMouseEnter={() => setIsProPaused(true)}
                      onMouseLeave={() => setIsProPaused(false)}
                      onClick={() => proCarouselRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                      className="p-1.5 rounded-full bg-slate-800/50 border border-white/5 hover:bg-slate-700 hover:border-indigo-500/50 transition-all text-slate-400 hover:text-indigo-400"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onMouseEnter={() => setIsProPaused(true)}
                      onMouseLeave={() => setIsProPaused(false)}
                      onClick={() => proCarouselRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                      className="p-1.5 rounded-full bg-slate-800/50 border border-white/5 hover:bg-slate-700 hover:border-indigo-500/50 transition-all text-slate-400 hover:text-indigo-400"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div
                  className="relative group"
                  onMouseEnter={() => setIsProPaused(true)}
                  onMouseLeave={() => setIsProPaused(false)}
                >
                  <div
                    ref={proCarouselRef}
                    id="pro-carousel"
                    onScroll={handleProScroll}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                    style={{ scrollBehavior: 'auto' }}
                  >
                    {infinitePro.map((merchant, index) => (
                      <div
                        key={`${merchant.id}-${index}`}
                        onClick={() => handleMerchantClick(merchant)}
                        className="min-w-[280px] w-[280px] shrink-0 bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-4 cursor-pointer hover:bg-slate-800/80 hover:border-indigo-500/60 transition-all duration-700 ease-out group/pro"
                      >
                        <div className="h-40 bg-slate-700 rounded-xl mb-4 overflow-hidden relative">
                          <img src={merchant.image || `https://source.unsplash.com/random/400x300/?${merchant.category}`} alt={merchant.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover/pro:translate-y-0 transition-transform duration-500 ease-out flex justify-center">
                            <span className="text-white text-xs font-bold flex items-center gap-1">Ver Perfil <ChevronRight size={14} /></span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1 truncate">{merchant.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold rounded flex items-center gap-1">Pro <Star size={10} className="fill-indigo-400" /></span>
                          <span className="text-xs text-slate-500 truncate">{merchant.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Basic & Free Grid */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                Outros Estabelecimentos
              </h2>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Basic Plans - Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMerchants.filter(m => m.plan === 'basic').map(merchant => (
                      <div
                        key={merchant.id}
                        onClick={() => handleMerchantClick(merchant)}
                        className="group bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-white/20 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="aspect-video bg-slate-700/50 rounded-xl mb-4 overflow-hidden relative">
                          <img
                            src={merchant.image || `https://source.unsplash.com/random/400x300/?${merchant.category}`}
                            alt={merchant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium text-white flex items-center gap-1">
                            <Store size={10} /> Básico
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-slate-300 group-hover:text-white mb-1 transition-colors">{merchant.name}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-3">{merchant.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Free Plans - Compact List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMerchants.filter(m => m.plan === 'free').map(merchant => (
                      <div
                        key={merchant.id}
                        onClick={() => handleMerchantClick(merchant)}
                        className="bg-slate-800/20 hover:bg-slate-800/60 border border-dashed border-slate-700 hover:border-slate-600 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] group flex flex-col justify-between h-full"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-400 group-hover:text-slate-200 transition-colors line-clamp-1">{merchant.name}</h3>
                            <CircleDashed size={14} className="text-slate-600 group-hover:text-slate-500 mt-1" />
                          </div>
                          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{merchant.description || 'Estabelecimento local.'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700 group-hover:border-slate-500 transition-colors">{merchant.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  </p>
                </div>
              )}
            </section>
          </>
        );
    }
  };

  return (
    <div className="dark">
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">

        {/* Mobile Header */}
        <header className="lg:hidden bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg tracking-tight">TB</span>
            </div>
            <h1 className="font-bold text-lg text-white">TemNoBairro</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={() => currentUser ? setUserMenuOpen(!userMenuOpen) : setIsLoginOpen(true)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors relative group"
            >
              {currentUser ? (
                currentUser.photoURL ?
                  <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-8 h-8 rounded-full border-2 border-indigo-500" />
                  : <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">{currentUser.displayName?.[0] || 'U'}</div>
              ) : (
                <User className="text-slate-400 group-hover:text-white transition-colors" size={24} />
              )}
            </button>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar (Desktop) */}
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
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
                <div className="hidden lg:flex items-center gap-4">
                  <NotificationBell />

                  {currentUser ? (
                    <div className="relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-3 bg-slate-800/50 p-1.5 pr-4 rounded-full border border-white/5 hover:border-white/10 transition-all"
                      >
                        {currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="User" className="w-9 h-9 rounded-full border border-indigo-500/30" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                            {currentUser.displayName?.[0] || 'U'}
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-slate-400 font-medium">Olá,</span>
                          <span className="text-sm font-bold text-slate-200 leading-none">{currentUser.displayName?.split(' ')[0]}</span>
                        </div>
                        <ChevronDown size={16} className="text-slate-400" />
                      </button>

                      {/* User Dropdown Menu */}
                      {userMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                          <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                            <div className="p-2 space-y-1">
                              {(isAdmin || isMaster) && (
                                <button
                                  onClick={() => { setCurrentView('admin'); setUserMenuOpen(false); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                  <LayoutDashboard size={16} />
                                  Painel Admin
                                </button>
                              )}
                              {isMerchant && (
                                <button
                                  onClick={() => { setCurrentView('merchant-panel'); setUserMenuOpen(false); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                  <Store size={16} />
                                  Painel do Comerciante
                                </button>
                              )}
                              <button
                                onClick={() => { setCurrentView('resident-panel'); setUserMenuOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                              >
                                <UserCircle size={16} />
                                Minha Conta
                              </button>
                              <div className="h-px bg-white/10 my-1" />
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <LogOut size={16} />
                                Sair
                              </button>
                            </div>
                          </div>
                        </>
                      )}
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
                {renderView()}
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
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSuccess={() => setIsLoginOpen(false)}
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

      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
