import { create } from 'zustand';

const useUiStore = create((set) => ({
  currentView: 'merchants',
  isLoginOpen: false,
  isSidebarOpen: false,
  showCreateAd: false,
  selectedMerchant: null,
  selectedService: null,

  setCurrentView: (view) => set({ currentView: view }),
  setIsLoginOpen: (isOpen) => set({ isLoginOpen: isOpen }),
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setShowCreateAd: (show) => set({ showCreateAd: show }),
  setSelectedMerchant: (merchant) => set({ selectedMerchant: merchant }),
  setSelectedService: (service) => set({ selectedService: service }),
}));

export const selectCurrentView = (state) => state.currentView;
export const selectIsLoginOpen = (state) => state.isLoginOpen;
export const selectIsSidebarOpen = (state) => state.isSidebarOpen;
export const selectShowCreateAd = (state) => state.showCreateAd;
export const selectSelectedMerchant = (state) => state.selectedMerchant;
export const selectSelectedService = (state) => state.selectedService;

export default useUiStore;
