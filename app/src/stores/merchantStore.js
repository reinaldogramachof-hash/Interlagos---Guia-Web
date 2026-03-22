import { create } from 'zustand';
import { subscribeMerchants } from '../services/merchantService';

const useMerchantStore = create((set) => ({
  merchants: [],
  loading: true,
  selectedCategory: 'Todos',
  searchTerm: '',

  setMerchants: (merchants) => set({ merchants }),
  setLoading: (loading) => set({ loading }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchTerm: (term) => set({ searchTerm: term }),

  init: () => {
    const unsub = subscribeMerchants((data) => {
      set({ merchants: data, loading: false });
    });
    return unsub;
  }
}));

export const selectMerchants = (state) => state.merchants;
export const selectMerchantsLoading = (state) => state.loading;
export const selectSelectedCategory = (state) => state.selectedCategory;
export const selectSearchTerm = (state) => state.searchTerm;

export default useMerchantStore;
