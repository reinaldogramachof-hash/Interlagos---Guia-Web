import useUiStore, { selectCurrentView } from '../stores/uiStore';
import useMerchantStore, { selectMerchants, selectMerchantsLoading, selectSelectedCategory, selectSearchTerm } from '../stores/merchantStore';

import MerchantsView from '../features/merchants/MerchantsView';
import AdminPanel from '../features/admin/AdminPanel';
import MerchantPanel from '../features/merchants/MerchantPanel';
import ResidentPanel from '../features/community/ResidentPanel';
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

export default function AppRouter({ requireAuth }) {
  const currentView = useUiStore(selectCurrentView);
  const setCurrentView = useUiStore(state => state.setCurrentView);
  const setIsLoginOpen = useUiStore(state => state.setIsLoginOpen);
  const setSelectedMerchant = useUiStore(state => state.setSelectedMerchant);
  const setSelectedService = useUiStore(state => state.setSelectedService);
  const merchants = useMerchantStore(selectMerchants);
  const loading = useMerchantStore(selectMerchantsLoading);
  const selectedCategory = useMerchantStore(selectSelectedCategory);
  const searchTerm = useMerchantStore(selectSearchTerm);

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
}
