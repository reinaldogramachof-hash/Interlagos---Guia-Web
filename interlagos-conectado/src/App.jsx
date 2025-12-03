import React, { useState, useEffect } from 'react';
import {
  Store,
  Newspaper,
  Heart,
  AlertTriangle,
  Search,
  Menu,
  User,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Utensils,
  Car,
  Dumbbell,
  Scissors,
  Briefcase,
  MoreHorizontal,
  LogOut,
  Settings,
  PlusCircle,
  Home
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Components
import LoginModal from './LoginModal';
import MerchantDetailModal from './MerchantDetailModal';
import AdminPanel from './AdminPanel';

// Views
import AdsView from './AdsView';
import NewsFeed from './NewsFeed';
import DonationsView from './DonationsView';
import UtilityView from './UtilityView';
import PremiumCarousel from './PremiumCarousel';
import SuperPremiumCarousel from './SuperPremiumCarousel';

// Mock Data for Merchants (moved from component to avoid clutter, or keep if small)
// For brevity, I'll assume we fetch or have mock data. 
// Re-implementing the mock data here for the 'merchants' view to work.

const mockMerchants = [
  {
    id: 1,
    name: 'Padaria do Nonno',
    category: 'Alimentação',
    description: 'Pães artesanais e confeitaria fina. O melhor café da manhã do bairro.',
    address: 'Rua das Flores, 123',
    phone: '(11) 5555-1234',
    whatsapp: '11999991234',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500',
    isPremium: true,
    plan: 'super',
    gallery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500'
    ]
  },
  {
    id: 2,
    name: 'Academia PowerFit',
    category: 'Saúde',
    description: 'Musculação, aulas coletivas e natação. Aberto 24h.',
    address: 'Av. Principal, 1000',
    phone: '(11) 5555-5678',
    whatsapp: '11988885678',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=500',
    isPremium: true,
    plan: 'premium',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=500'
    ]
  },
  {
    id: 3,
    name: 'Oficina Mecânica Veloz',
    category: 'Automotivo',
    description: 'Mecânica geral, funilaria e pintura. Atendemos todas as seguradoras.',
    address: 'Rua do Motor, 50',
    phone: '(11) 5555-9012',
    whatsapp: '11977779012',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e41600f2e?auto=format&fit=crop&q=80&w=500',
    isPremium: false,
    plan: 'basic'
  },
  {
    id: 4,
    name: 'Salão Beleza Pura',
    category: 'Beleza',
    description: 'Cortes, coloração, manicure e estética facial.',
    address: 'Praça da Beleza, 20',
    phone: '(11) 5555-3456',
    whatsapp: '11966663456',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=500',
    isPremium: false,
    plan: 'basic'
  }
];

const categories = [
  { id: 'Todos', label: 'Todos', icon: <Store size={20} /> },
  { id: 'Alimentação', label: 'Alimentação', icon: <Utensils size={20} /> },
  { id: 'Saúde', label: 'Saúde', icon: <Dumbbell size={20} /> },
  { id: 'Automotivo', label: 'Automotivo', icon: <Car size={20} /> },
  { id: 'Beleza', label: 'Beleza', icon: <Scissors size={20} /> },
  { id: 'Serviços', label: 'Serviços', icon: <Briefcase size={20} /> },
  { id: 'Outros', label: 'Outros', icon: <MoreHorizontal size={20} /> }
];

export default function App() {
  const [currentView, setCurrentView] = useState('merchants');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [merchants, setMerchants] = useState(mockMerchants);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const handleMerchantClick = (merchant) => {
    setSelectedMerchant(merchant);
  };

  const handleTrackClick = (id) => {
    console.log("Track click:", id);
  };

  const filteredMerchants = merchants.filter(merchant => {
    const matchesCategory = selectedCategory === 'Todos' || merchant.category === selectedCategory;
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedMerchants = [...filteredMerchants].sort((a, b) => {
    // Super Premium first, then Premium, then Basic
    const score = (plan) => {
      if (plan === 'super') return 3;
      if (plan === 'premium') return 2;
      return 1;
    };
    return score(b.plan) - score(a.plan);
  });

  const navItems = [
    { id: 'merchants', label: 'Comércio', icon: <Store size={20} /> },
    { id: 'ads', label: 'Anúncios', icon: <ShoppingBag size={20} /> },
    { id: 'news', label: 'Notícias', icon: <Newspaper size={20} /> },
    { id: 'donations', label: 'Doações', icon: <Heart size={20} /> },
    { id: 'utility', label: 'Utilidade', icon: <AlertTriangle size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 pb-20 md:pb-0 md:pl-64">

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 z-50">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <MapPin className="fill-indigo-600 text-white" />
            Interlagos
          </h1>
          <p className="text-xs text-gray-400 mt-1">Guia Digital do Bairro</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                ${currentView === item.id
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          {user ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                {user.displayName ? user.displayName[0] : <User size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user.displayName || 'Usuário'}</p>
                <button onClick={handleLogout} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                  <LogOut size={12} /> Sair
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <MapPin size={18} />
          </div>
          <span className="font-bold text-gray-900">Interlagos</span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs" onClick={handleLogout}>
              {user.displayName ? user.displayName[0] : <User size={16} />}
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <User size={24} />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">

        {/* Search Bar (Global) */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="O que você procura hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* View Content */}
        {currentView === 'merchants' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Categories (Mobile) */}
            <div className="md:hidden mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl text-[10px] font-bold transition-all border
                      ${selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-500 border-gray-100'}`}
                  >
                    <div className="mb-1">{cat.icon}</div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories (Desktop) */}
            <div className="hidden md:flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border
                      ${selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'}`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Super Premium Carousel */}
            {!loading && filteredMerchants.some(m => m.plan === 'super') && (
              <SuperPremiumCarousel
                merchants={filteredMerchants.filter(m => m.plan === 'super')}
                categories={categories}
                onMerchantClick={handleMerchantClick}
              />
            )}

            {/* Premium Carousel */}
            {!loading && filteredMerchants.some(m => m.plan === 'premium' || (m.isPremium && m.plan !== 'super')) && (
              <PremiumCarousel
                merchants={filteredMerchants.filter(m => m.plan === 'premium' || (m.isPremium && m.plan !== 'super'))}
                categories={categories}
                onMerchantClick={handleMerchantClick}
              />
            )}

            {/* Basic List */}
            <section className="mt-8">
              <h2 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
                <Store className="text-indigo-600" size={24} />
                Explorar Bairro
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedMerchants.filter(m => (!m.isPremium || m.plan === 'basic') && m.plan !== 'super' && m.plan !== 'premium').map((merchant) => (
                  <div
                    key={merchant.id}
                    onClick={() => handleMerchantClick(merchant)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-4 items-start cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gray-50 overflow-hidden">
                      {merchant.image ? (
                        <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Store />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base truncate">{merchant.name}</h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 mb-2 inline-block">
                        {merchant.category}
                      </span>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{merchant.description}</p>

                      {merchant.whatsapp && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://wa.me/55${merchant.whatsapp.replace(/\D/g, '')}`, '_blank');
                          }}
                          className="text-green-600 text-xs font-bold flex items-center gap-1 hover:underline"
                        >
                          <MessageCircle size={12} />
                          WhatsApp
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === 'ads' && <AdsView />}
        {currentView === 'news' && <NewsFeed />}
        {currentView === 'donations' && <DonationsView />}
        {currentView === 'utility' && <UtilityView />}

      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center z-50 pb-safe">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all
              ${currentView === item.id
                ? 'text-indigo-600'
                : 'text-gray-400 hover:text-gray-600'}`}
          >
            {React.cloneElement(item.icon, { size: 24, className: currentView === item.id ? 'fill-current' : '' })}
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={(user) => {
            console.log("Logado:", user);
            setShowLoginModal(false);
          }}
        />
      )}

      {showAdmin && (
        <AdminPanel
          merchants={merchants}
          categories={categories}
          onClose={() => setShowAdmin(false)}
        />
      )}

      <MerchantDetailModal
        isOpen={!!selectedMerchant}
        onClose={() => setSelectedMerchant(null)}
        merchant={selectedMerchant}
      />

    </div>
  );
}
