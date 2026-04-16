import { useEffect } from 'react';
import useUiStore, { selectCurrentView, selectSelectedStore } from '../stores/uiStore';
import useMerchantStore, { selectMerchants, selectMerchantsLoading, selectSelectedCategory, selectSearchTerm } from '../stores/merchantStore';

import MerchantsView from '../features/merchants/MerchantsView';
import VitrineView from '../features/vitrine/VitrineView';
import MerchantStorePage from '../features/vitrine/MerchantStorePage';
import AdminPanel from '../features/admin/AdminPanel';
import UnifiedPanel from '../features/dashboard/UnifiedPanel';
import NewsFeed from '../features/news/NewsFeed';
import AdsView from '../features/ads/AdsView';
import DonationsView from '../features/community/DonationsView';
import UtilityView from '../features/community/UtilityView';
import HistoryView from '../features/community/HistoryView';
import SuggestionsView from '../features/community/SuggestionsView';
import ManagementView from '../features/plans/ManagementView';
import PlansView from '../features/plans/PlansView';
import MerchantLandingView from '../features/merchants/MerchantLandingView';
import ProfileView from '../features/auth/ProfileView';
import PollsView from '../features/community/PollsView';
import SupportView from '../features/support/SupportView';
import MembersLandingView from '../features/members/MembersLandingView';
import MemberPanelView from '../features/members/MemberPanelView';
import CouponsView from '../features/merchants/CouponsView';
import SecurityView from '../features/security/SecurityView';

export default function AppRouter({ requireAuth }) {
  const currentView = useUiStore(selectCurrentView);
  const setCurrentView = useUiStore(state => state.setCurrentView);
  const setIsLoginOpen = useUiStore(state => state.setIsLoginOpen);
  const setSelectedMerchant = useUiStore(state => state.setSelectedMerchant);
  const setSelectedService = useUiStore(state => state.setSelectedService);
  const selectedStore = useUiStore(selectSelectedStore);
  const setSelectedStore = useUiStore(state => state.setSelectedStore);
  const merchants = useMerchantStore(selectMerchants);
  const loading = useMerchantStore(selectMerchantsLoading);
  const selectedCategory = useMerchantStore(selectSelectedCategory);
  const searchTerm = useMerchantStore(selectSearchTerm);

  // URL param: ?store=<id> abre a loja ao carregar o app
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storeId = params.get('store');
    if (storeId) setSelectedStore({ id: storeId, _needsFetch: true });
  }, []);

  const goToMerchantPanel = () => requireAuth(() => setCurrentView('merchant-panel'));

  // Overlay de prioridade máxima: loja selecionada
  if (selectedStore) {
    return (
      <MerchantStorePage
        merchant={selectedStore}
        onBack={() => { setSelectedStore(null); setCurrentView('vitrine'); }}
        onMerchantClick={setSelectedMerchant}
      />
    );
  }

  switch (currentView) {
    case 'security': return <SecurityView />;
    case 'vitrine': return (
      <VitrineView
        onMerchantClick={setSelectedMerchant}
        onStoreClick={(m) => setSelectedStore(m)}
        onViewCoupons={() => setCurrentView('coupons')}
      />
    );
    case 'news': return <NewsFeed />;
    case 'ads': return <AdsView onRequireAuth={requireAuth} />;
    case 'donations': return <DonationsView />;
    case 'utility': return <UtilityView onServiceClick={setSelectedService} />;
    case 'history': return <HistoryView />;
    case 'suggestions': return <SuggestionsView />;
    case 'management': return <ManagementView />;
    case 'plans': return <PlansView onRegisterFree={goToMerchantPanel} onNavigate={setCurrentView} />;
    case 'merchant-landing': return <MerchantLandingView onRegisterClick={() => setCurrentView('plans')} onRegisterFree={goToMerchantPanel} />;
    case 'profile': return <ProfileView onLoginOpen={() => setIsLoginOpen(true)} onNavigate={setCurrentView} />;
    case 'admin': return <AdminPanel onClose={() => setCurrentView('news')} />;
    case 'merchant-panel':
    case 'resident-panel':
      return <UnifiedPanel onClose={() => setCurrentView('profile')} />;
    case 'polls': return <PollsView onRequireAuth={requireAuth} />;
    case 'support': return <SupportView />;
    case 'members-landing': return <MembersLandingView onNavigate={setCurrentView} />;
    case 'member-panel': return requireAuth(() => <MemberPanelView onNavigate={setCurrentView} />) || null;
    case 'coupons':
      return (
        <CouponsView
          onMerchantClick={setSelectedMerchant}
          onBack={() => setCurrentView('merchants')}
        />
      );
    case 'merchants':
    default:
      return (
        <MerchantsView
          merchants={merchants}
          loading={loading}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onMerchantClick={setSelectedMerchant}
          onViewCoupons={() => setCurrentView('coupons')}
        />
      );
  }
}
