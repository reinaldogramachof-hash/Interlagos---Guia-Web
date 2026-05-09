import { create } from 'zustand';
import { getMerchantsList, subscribeMerchants } from '../services/merchantService';

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 min

const cacheKey = () => `tnb:merchants:${import.meta.env.VITE_NEIGHBORHOOD || 'default'}`;

function loadCachedMerchants() {
  try {
    const raw = localStorage.getItem(cacheKey());
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || !Array.isArray(parsed?.data)) return null;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

function saveCachedMerchants(data) {
  try {
    localStorage.setItem(cacheKey(), JSON.stringify({
      savedAt: Date.now(),
      data,
    }));
  } catch {
    // localStorage pode falhar em modo privado/quota cheia; ignora.
  }
}

const useMerchantStore = create((set) => ({
  merchants: [],
  loading: true,
  selectedCategory: 'Todos',
  searchTerm: '',
  initialized: false,

  setMerchants: (merchants) => set({ merchants }),
  setLoading: (loading) => set({ loading }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchTerm: (term) => set({ searchTerm: term }),

  // Inicialização pública: entrega cache primeiro e atualiza via rede em background.
  // Evita abrir canal realtime para todo visitante na primeira tela.
  init: () => {
    let cancelled = false;

    const cached = loadCachedMerchants();
    if (cached?.length) {
      set({ merchants: cached, loading: false, initialized: true });
    } else {
      set({ loading: true });
    }

    getMerchantsList()
      .then((data) => {
        if (cancelled) return;
        set({ merchants: data, loading: false, initialized: true });
        saveCachedMerchants(data);
      })
      .catch((err) => {
        console.error('[merchantStore] init error:', err);
        if (!cancelled) set({ loading: false, initialized: true });
      });

    return () => { cancelled = true; };
  },

  // Usar apenas em telas que realmente precisam de atualizações ao vivo
  // (ex: admin/painéis), não na home pública.
  initRealtime: () => {
    const unsub = subscribeMerchants((data) => {
      set({ merchants: data, loading: false, initialized: true });
      saveCachedMerchants(data);
    });
    return unsub;
  }
}));

export const selectMerchants = (state) => state.merchants;
export const selectMerchantsLoading = (state) => state.loading;
export const selectSelectedCategory = (state) => state.selectedCategory;
export const selectSearchTerm = (state) => state.searchTerm;

export default useMerchantStore;
