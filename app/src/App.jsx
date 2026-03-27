import React, { useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import useAuthStore from './stores/authStore';
import BottomNav from './components/BottomNav';
import AppHeader from './components/AppHeader';

import useUiStore, { selectCurrentView, selectIsSidebarOpen, selectIsLoginOpen, selectShowCreateAd, selectSelectedMerchant, selectSelectedService } from './stores/uiStore';
import useMerchantStore from './stores/merchantStore';
import useRequireAuth from './hooks/useRequireAuth';
import AppRouter from './app/Router';

import SidebarMenu from './components/SidebarMenu';
import CreateAdWizard from './features/ads/CreateAdWizard';

// Modais
import MerchantDetailModal from './features/merchants/MerchantDetailModal';
import ServiceDetailModal from './features/merchants/ServiceDetailModal';
import LoginModal from './features/auth/LoginModal';
import OnboardingModal from './features/auth/OnboardingModal';

import { PlusCircle } from 'lucide-react';

function AppContent() {
  const { currentUser } = useAuth();
  const initMerchants = useMerchantStore(state => state.init);
  const session = useAuthStore(state => state.session);
  const profile = useAuthStore(state => state.profile);
  const refreshProfile = useAuthStore(state => state.refreshProfile);
  
  const currentView = useUiStore(selectCurrentView);
  const isSidebarOpen = useUiStore(selectIsSidebarOpen);
  const isLoginOpen = useUiStore(selectIsLoginOpen);
  const showCreateAd = useUiStore(selectShowCreateAd);
  const selectedMerchant = useUiStore(selectSelectedMerchant);
  const selectedService = useUiStore(selectSelectedService);

  const setCurrentView = useUiStore(state => state.setCurrentView);
  const setIsSidebarOpen = useUiStore(state => state.setIsSidebarOpen);
  const setIsLoginOpen = useUiStore(state => state.setIsLoginOpen);
  const setShowCreateAd = useUiStore(state => state.setShowCreateAd);
  const setSelectedMerchant = useUiStore(state => state.setSelectedMerchant);
  const setSelectedService = useUiStore(state => state.setSelectedService);

  const { requireAuth, handleLoginSuccess } = useRequireAuth();

  const handleCloseMerchant = useCallback(() => setSelectedMerchant(null), [setSelectedMerchant]);
  const handleCloseService  = useCallback(() => setSelectedService(null),  [setSelectedService]);
  const handleCloseSidebar  = useCallback(() => setIsSidebarOpen(false),   [setIsSidebarOpen]);
  const handleCloseLogin    = useCallback(() => setIsLoginOpen(false),      [setIsLoginOpen]);

  useEffect(() => {
    const unsub = initMerchants();
    return () => unsub();
  }, [initMerchants]);

  if (showCreateAd) {
    return <CreateAdWizard onClose={() => setShowCreateAd(false)} user={currentUser} isOpen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onNavigate={setCurrentView}
        onLoginOpen={() => setIsLoginOpen(true)}
      />

      <div className="w-full relative min-h-screen bg-gray-50 flex flex-col">
        <AppHeader
          currentView={currentView}
          onLoginOpen={() => setIsLoginOpen(true)}
          onSidebarOpen={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 pt-14 pb-20">
          <div className="animate-in fade-in duration-300 h-full">
            <AppRouter requireAuth={requireAuth} />
          </div>
        </main>

        {currentView === 'ads' && (
          <button
            onClick={() => requireAuth(() => setShowCreateAd(true))}
            className="fixed bottom-24 right-4 z-30 bg-brand-600 text-white flex items-center gap-2 px-5 py-3.5 rounded-pill shadow-fab hover:bg-brand-700 hover:scale-105 transition-all font-bold text-sm"
          >
            <PlusCircle size={20} />
            Anunciar Grátis
          </button>
        )}

        <BottomNav
          currentView={currentView}
          onNavigate={setCurrentView}
          onCreateAd={() => requireAuth(() => setShowCreateAd(true))}
        />
      </div>

      {selectedMerchant && (
        <MerchantDetailModal
          merchant={selectedMerchant}
          onClose={handleCloseMerchant}
          onLoginRequired={requireAuth}
        />
      )}
      {isLoginOpen && (
        <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} onSuccess={handleLoginSuccess} />
      )}
      <OnboardingModal
        isOpen={!!session && profile?.onboarding_completed === false}
        onComplete={refreshProfile}
      />
      {selectedService && (
        <ServiceDetailModal isOpen={true} service={selectedService} onClose={handleCloseService} />
      )}
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
