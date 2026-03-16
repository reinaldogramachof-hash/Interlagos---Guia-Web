import { useState, useEffect, useRef } from 'react';
import { subscribeMerchants } from './services/merchantService';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav, { NAV_ITEMS } from './components/BottomNav';
import ProfileView from './features/auth/ProfileView';
import AppHeader from './components/AppHeader';

// Views
import MerchantsView from './features/merchants/MerchantsView';
import AdminPanel from './features/admin/AdminPanel';
import MerchantPanel from './features/merchants/MerchantPanel';
import ResidentPanel from './features/community/ResidentPanel';
import NewsFeed from './features/news/NewsFeed';
import AdsView from './features/ads/AdsView';
import DonationsView from './features/community/DonationsView';
import UtilityView from './features/community/UtilityView';
import HistoryView from './features/community/HistoryView';
import SuggestionsView from './features/community/SuggestionsView';
import ManagementView from './features/plans/ManagementView';
import PlansView from './features/plans/PlansView';
import MerchantLandingView from './features/merchants/MerchantLandingView';
import CreateAdWizard from './features/ads/CreateAdWizard';
import SidebarMenu from './components/SidebarMenu';

// Modais
import MerchantDetailModal from './features/merchants/MerchantDetailModal';
import AdDetailModal from './features/ads/AdDetailModal';
import NewsDetailModal from './features/news/NewsDetailModal';
import ServiceDetailModal from './features/merchants/ServiceDetailModal';
import CampaignDetailModal from './features/merchants/CampaignDetailModal';
import LoginModal from './features/auth/LoginModal';

import { PlusCircle } from 'lucide-react';



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

  // Views que não usam o app shell padrão (full-screen) - Removido para unificar navegação

  const renderView = () => {
    const view = (() => {
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
        case 'admin': return <AdminPanel onClose={() => setCurrentView('news')} />;
        case 'merchant-panel': return <MerchantPanel onClose={() => setCurrentView('profile')} />;
        case 'resident-panel': return <ResidentPanel />;
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
    })();
    return <div>{view}</div>;
  };

  const showBottomNav = true;

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
      <div className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto relative min-h-screen bg-gray-50 shadow-2xl shadow-black/5 flex flex-col">
        
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
            className="fixed bottom-24 right-4 z-30 bg-brand-600 text-white flex items-center gap-2 px-5 py-3.5 rounded-pill shadow-fab hover:bg-brand-700 hover:scale-105 transition-all font-bold text-sm"
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
