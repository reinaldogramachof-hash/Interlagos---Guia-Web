import { create } from 'zustand';
import { subscribeAds } from '../services/adsService';

const useAdsStore = create((set, get) => ({
  ads: [],
  loading: true,
  initialized: false,

  init: () => {
    if (get().initialized) return () => {};
    set({ initialized: true });

    const unsub = subscribeAds((data) => {
      set({ ads: data || [], loading: false });
    });

    return () => {
      unsub();
      set({ initialized: false, loading: true });
    };
  },
}));

export const selectAds = (s) => s.ads;
export const selectAdsLoading = (s) => s.loading;

export default useAdsStore;
