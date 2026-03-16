import { useState, useEffect, useRef } from 'react';
import { subscribeMerchants } from './services/merchantService';
import { AuthProvider, useAuth } from './context/AuthContext';
import useMerchantPlan from './hooks/useMerchantPlan';

// Views
import MerchantsView from './features/merchants/MerchantsView';
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
import CreateAdWizard from './CreateAdWizard';
import SidebarMenu from './SidebarMenu';

// Modais
import MerchantDetailModal from './MerchantDetailModal';
import AdDetailModal from './AdDetailModal';
import NewsDetailModal from './NewsDetailModal';
import ServiceDetailModal from './ServiceDetailModal';
import CampaignDetailModal from './CampaignDetailModal';
import LoginModal from './LoginModal';

import { Home, Store, Tag, User, PlusCircle, Menu, Newspaper, Heart } from 'lucide-react';

// ─── Bottom Navigation ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'merchants', label: 'Home', icon: Home },
  { id: 'news', label: 'Jornal', icon: Newspaper },
  { id: 'ads', label: 'Classificados', icon: Tag },
  { id: 'donations', label: 'Campanhas', icon: Heart },
];

function BottomNav({ currentView, onNavigate, onCreateAd }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-md md:max-w-2xl lg:max-w-5xl mx-auto flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all relative ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-indigo-600 rounded-t-full shadow-[0_-2px_6px_rgba(79,70,229,0.3)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Header do App ────────────────────────────────────────────────────────────
function AppHeader({ currentView, onLoginOpen, onSidebarOpen }) {
  const { currentUser } = useAuth();

  const titles = {
    news: 'Jornal do Bairro',
    merchants: 'Comércios',
    ads: 'Classificados',
    profile: 'Meu Perfil',
    utility: 'Utilidade Pública',
    history: 'História do Bairro',
    donations: 'Doações e Campanhas',
    suggestions: 'Sugestões',
    plans: 'Planos e Preços',
    'merchant-landing': 'Para Comerciantes',
  };
  const title = titles[currentView] || 'Interlagos Conectado';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-md md:max-w-2xl lg:max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        {/* Botão Hamburguer */}
        <button
          onClick={onSidebarOpen}
          className="p-2 -ml-1 rounded-xl text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo + Título centralizados */}
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <img src="/logoIC.png" alt="Logo" className="w-7 h-7 rounded-lg object-contain" onError={e => e.target.style.display = 'none'} />
          <h1 className="text-base md:text-lg font-black text-gray-900 tracking-tight">{title}</h1>
        </div>

        {/* Botão de Login (só quando deslogado) */}
        {!currentUser && (
          <button
            onClick={onLoginOpen}
            className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
          >
            Entrar
          </button>
        )}
        {/* Espaço reservado quando logado para manter alinhamento */}
        {currentUser && <div className="w-10" />}
      </div>
    </header>
  );
}

// ─── Quick Action helper ──────────────────────────────────────────────────────
function QuickAction({ emoji, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-semibold text-gray-700 flex-1 text-left">{label}</span>
      <span className="text-gray-300 text-xs">›</span>
    </button>
  );
}

// ─── Profile View ─────────────────────────────────────────────────────────────
function ProfileView({ onLoginOpen, onNavigate }) {
  const { currentUser, isMerchant, isAdmin, isMaster, logout } = useAuth();
  const { planId, plan } = useMerchantPlan();

  // ── Visitante (sem login) ──────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="px-4 pt-8 pb-24 flex flex-col items-center gap-5">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-5xl">
          👤
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bem-vindo!</h2>
          <p className="text-gray-500 text-sm">Faça login para acessar seu perfil e recursos exclusivos.</p>
        </div>

        <button
          onClick={onLoginOpen}
          className="w-full max-w-xs bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
        >
          Entrar / Cadastrar
        </button>

        <div className="w-full max-w-xs bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col gap-1">
          <p className="text-amber-800 font-bold text-sm">🏪 Tem um negócio no bairro?</p>
          <p className="text-amber-700 text-xs">Cadastre seu comércio e alcance milhares de moradores.</p>
          <button
            onClick={() => onNavigate('merchant-landing')}
            className="text-amber-700 font-bold text-xs hover:underline text-left mt-1"
          >
            Ver planos e preços →
          </button>
        </div>
      </div>
    );
  }

  // ── Usuário logado ─────────────────────────────────────────────────────────
  const initials = (currentUser.displayName || currentUser.email || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const roleMeta = {
    master: { label: 'Master', emoji: '⚡', color: 'bg-purple-100 text-purple-700' },
    admin: { label: 'Admin', emoji: '🛡️', color: 'bg-blue-100 text-blue-700' },
    merchant: { label: 'Comerciante', emoji: '🏪', color: 'bg-amber-100 text-amber-700' },
    resident: { label: 'Morador', emoji: '🏘️', color: 'bg-green-100 text-green-700' },
  };
  const role = isMaster ? 'master' : isAdmin ? 'admin' : isMerchant ? 'merchant' : 'resident';
  const rmeta = roleMeta[role];

  return (
    <div className="pb-24">
      {/* Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 px-5 pt-10 pb-16 relative">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl" />
      </div>

      <div className="px-4 -mt-12 flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-indigo-600">
          {initials}
        </div>

        {/* Nome + Role */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900">
            {currentUser.displayName || currentUser.email?.split('@')[0]}
          </h2>
          <p className="text-xs text-gray-400 mb-2">{currentUser.email}</p>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${rmeta.color}`}>
            {rmeta.emoji} {rmeta.label}
          </span>
        </div>

        {/* Card do Comerciante */}
        {isMerchant && (
          <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 text-sm">Plano Atual</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${planId === 'premium' ? 'bg-amber-100 text-amber-700' :
                  planId === 'professional' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                {plan.badge ?? '🔵 Básico'}
              </span>
            </div>
            <button
              onClick={() => onNavigate('merchant-panel')}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              📊 Abrir Painel do Comerciante
            </button>
            {planId !== 'premium' && (
              <button
                onClick={() => onNavigate('plans')}
                className="w-full mt-2 text-indigo-600 text-sm font-semibold py-2 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                Fazer Upgrade de Plano ↗️
              </button>
            )}
          </div>
        )}

        {/* Card do Admin/Master */}
        {(isAdmin || isMaster) && (
          <div className="w-full mt-1">
            <button
              onClick={() => onNavigate('admin')}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              🛡️ Painel Administrativo
            </button>
          </div>
        )}

        {/* Ações rápidas */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 mt-1">
          <QuickAction emoji="💡" label="Enviar Sugestão" onClick={() => onNavigate('suggestions')} />
          <QuickAction emoji="❤️" label="Doações e Campanhas" onClick={() => onNavigate('donations')} />
          <QuickAction emoji="🆘" label="Utilidade Pública" onClick={() => onNavigate('utility')} />
          {!isMerchant && (
            <QuickAction emoji="🏪" label="Quero anunciar meu comércio" onClick={() => onNavigate('merchant-landing')} />
          )}
        </div>

        {/* Sair */}
        <button
          onClick={async () => { await logout(); }}
          className="mt-2 text-red-500 text-sm font-semibold hover:underline"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}

// ─── App Content ──────────────────────────────────────────────────────────────
function AppContent() {
  const { currentUser } = useAuth();

  const [currentView, setCurrentView] = useState('merchants');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const pendingActionRef = useRef(null);

  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Lazy Login
  const requireAuth = (action) => {
    if (currentUser) { action(); }
    else { pendingActionRef.current = action; setIsLoginOpen(true); }
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setTimeout(action, 80);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeMerchants((data) => {
      setMerchants(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (showCreateAd) {
    return <CreateAdWizard onClose={() => setShowCreateAd(false)} user={currentUser} isOpen />;
  }

  // Views que não usam o app shell padrão (full-screen)
  const fullScreenViews = ['admin', 'merchant-panel', 'resident-panel'];
  if (fullScreenViews.includes(currentView)) {
    const viewMap = {
      'admin': <AdminPanel onClose={() => setCurrentView('news')} />,
      'merchant-panel': <MerchantPanel onClose={() => setCurrentView('profile')} />,
      'resident-panel': <ResidentPanel />,
    };
    return viewMap[currentView];
  }

  const renderView = () => {
    switch (currentView) {
      case 'news': return <NewsFeed />;
      case 'ads': return <AdsView onRequireAuth={requireAuth} />;
      case 'donations': return <DonationsView />;
      case 'utility': return <UtilityView onServiceClick={setSelectedService} />;
      case 'history': return <HistoryView />;
      case 'suggestions': return <SuggestionsView />;
      case 'management': return <ManagementView />;
      case 'plans': return <PlansView />;
      case 'merchant-landing': return <MerchantLandingView onRegisterClick={() => setCurrentView('plans')} />;
      case 'profile': return <ProfileView onLoginOpen={() => setIsLoginOpen(true)} onNavigate={setCurrentView} />;
      case 'merchants':
      default:
        return (
          <MerchantsView
            merchants={merchants}
            loading={loading}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onMerchantClick={setSelectedMerchant}
          />
        );
    }
  };

  const showBottomNav = NAV_ITEMS.some(n => n.id === currentView) || currentView === 'merchants';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Hamburguer — fora do max-w-md para ser full-screen */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={setCurrentView}
        onLoginOpen={() => setIsLoginOpen(true)}
      />

      {/* Shell centralizado responsivo: usa larguras fluidas em tablets (md/lg) para eliminar espaços vazios */}
      <div className="max-w-md md:max-w-[95%] lg:max-w-[92%] xl:max-w-7xl 2xl:max-w-[1440px] mx-auto relative min-h-screen bg-gray-50 shadow-2xl shadow-black/5 flex flex-col">
        
        <AppHeader
          currentView={currentView}
          onLoginOpen={() => setIsLoginOpen(true)}
          onSidebarOpen={() => setIsSidebarOpen(true)}
        />

        {/* Conteúdo principal com flex-1 para empurrar Bottom Nav se necessário */}
        <main className="flex-1 pb-20">
          <div className="animate-in fade-in duration-300 h-full">
            {renderView()}
          </div>
        </main>

        {/* FAB de classificados — responsivo no canto do container */}
        {currentView === 'ads' && (
          <button
            onClick={() => requireAuth(() => setShowCreateAd(true))}
            className="fixed bottom-20 md:bottom-24 right-4 md:right-auto md:ml-[calc(100%-10rem)] bg-indigo-600 text-white flex items-center gap-2 px-6 py-3.5 rounded-full shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 transition-all z-30 font-bold text-sm"
          >
            <PlusCircle size={20} />
            Anunciar Grátis
          </button>
        )}

        {/* Bottom Navigation centralizado no shell */}
        {showBottomNav && (
          <BottomNav
            currentView={currentView}
            onNavigate={setCurrentView}
            onCreateAd={() => requireAuth(() => setShowCreateAd(true))}
          />
        )}
      </div>

      {/* Modais — fora do max-w-md para overlay full-screen */}
      {selectedMerchant && (
        <MerchantDetailModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
          onLoginRequired={requireAuth}
        />
      )}
      {isLoginOpen && (
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSuccess={handleLoginSuccess} />
      )}
      {selectedAd && <AdDetailModal ad={selectedAd} onClose={() => setSelectedAd(null)} />}
      {selectedNews && <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />}
      {selectedService && <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} />}
      {selectedCampaign && <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />}
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
