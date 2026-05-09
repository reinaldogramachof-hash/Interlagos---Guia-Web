import React, { Suspense, lazy, useEffect } from 'react';
import useUiStore, { selectCurrentView, selectSelectedStore } from '../stores/uiStore';
import useMerchantStore, { selectMerchants, selectMerchantsLoading, selectSelectedCategory, selectSearchTerm } from '../stores/merchantStore';
import { SkeletonCard } from '../components/SkeletonCard';

const MerchantsView = lazy(() => import('../features/merchants/MerchantsView'));
const VitrineView = lazy(() => import('../features/vitrine/VitrineView'));
const MerchantStorePage = lazy(() => import('../features/vitrine/MerchantStorePage'));
const AdminPanel = lazy(() => import('../features/admin/AdminPanel'));
const UnifiedPanel = lazy(() => import('../features/dashboard/UnifiedPanel'));
const NewsFeed = lazy(() => import('../features/news/NewsFeed'));
const AdsView = lazy(() => import('../features/ads/AdsView'));
const DonationsView = lazy(() => import('../features/community/DonationsView'));
const UtilityView = lazy(() => import('../features/community/UtilityView'));
const HistoryView = lazy(() => import('../features/community/HistoryView'));
const SuggestionsView = lazy(() => import('../features/community/SuggestionsView'));
const ManagementView = lazy(() => import('../features/plans/ManagementView'));
const PlansView = lazy(() => import('../features/plans/PlansView'));
const MerchantLandingView = lazy(() => import('../features/merchants/MerchantLandingView'));
const ProfileView = lazy(() => import('../features/auth/ProfileView'));
const PollsView = lazy(() => import('../features/community/PollsView'));
const SupportView = lazy(() => import('../features/support/SupportView'));
const MembersLandingView = lazy(() => import('../features/members/MembersLandingView'));
const MemberPanelView = lazy(() => import('../features/members/MemberPanelView'));
const CouponsView = lazy(() => import('../features/merchants/CouponsView'));
const SecurityView = lazy(() => import('../features/security/SecurityView'));

function RouteFallback() {
  return (
    <div className="px-3 pt-4">
      <SkeletonCard count={3} />
    </div>
  );
}

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
  }, [setSelectedStore]);

  const goToMerchantPanel = () => requireAuth(() => setCurrentView('merchant-panel'));

  let route;

  if (selectedStore) {
    route = (
      <MerchantStorePage
        merchant={selectedStore}
        onBack={() => { setSelectedStore(null); setCurrentView('vitrine'); }}
        onMerchantClick={setSelectedMerchant}
      />
    );
  } else {
    switch (currentView) {
      case 'security': route = <SecurityView />; break;
      case 'vitrine': route = (
        <VitrineView
          onMerchantClick={setSelectedMerchant}
          onStoreClick={(m) => setSelectedStore(m)}
          onViewCoupons={() => setCurrentView('coupons')}
        />
      ); break;
      case 'news': route = <NewsFeed />; break;
      case 'ads': route = <AdsView onRequireAuth={requireAuth} />; break;
      case 'donations': route = <DonationsView />; break;
      case 'utility': route = <UtilityView onServiceClick={setSelectedService} />; break;
      case 'history': route = <HistoryView />; break;
      case 'suggestions': route = <SuggestionsView />; break;
      case 'management': route = <ManagementView />; break;
      case 'plans': route = <PlansView onRegisterFree={goToMerchantPanel} onNavigate={setCurrentView} />; break;
      case 'merchant-landing': route = <MerchantLandingView onRegisterClick={() => setCurrentView('plans')} onRegisterFree={goToMerchantPanel} />; break;
      case 'profile': route = <ProfileView onLoginOpen={() => setIsLoginOpen(true)} onNavigate={setCurrentView} />; break;
      case 'admin': route = <AdminPanel onClose={() => setCurrentView('news')} />; break;
      case 'merchant-panel':
      case 'resident-panel':
        route = <UnifiedPanel onClose={() => setCurrentView('profile')} />; break;
      case 'polls': route = <PollsView onRequireAuth={requireAuth} />; break;
      case 'support': route = <SupportView />; break;
      case 'members-landing': route = <MembersLandingView onNavigate={setCurrentView} />; break;
      case 'member-panel': route = requireAuth(() => <MemberPanelView onNavigate={setCurrentView} />) || null; break;
      case 'coupons': route = (
        <CouponsView
          onMerchantClick={setSelectedMerchant}
          onBack={() => setCurrentView('merchants')}
        />
      ); break;
      case 'merchants':
      default:
        route = (
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

  return <Suspense fallback={<RouteFallback />}>{route}</Suspense>;
}
