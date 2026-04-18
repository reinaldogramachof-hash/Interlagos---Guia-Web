import { create } from 'zustand';
import { subscribeNews, fetchCommentCounts } from '../services/newsService';

const useNewsStore = create((set, get) => ({
  news: [],
  commentCounts: {},
  loading: true,
  initialized: false,

  init: () => {
    if (get().initialized) return () => {};
    set({ initialized: true });

    const unsub = subscribeNews(async (data) => {
      const list = data || [];
      set({ news: list, loading: false });
      if (list.length > 0) {
        try {
          const counts = await fetchCommentCounts(list.map((n) => n.id));
          set({ commentCounts: counts || {} });
        } catch (_) { /* silenciar: contagem é secundária */ }
      } else {
        set({ commentCounts: {} });
      }
    });

    return () => {
      unsub();
      set({ initialized: false, loading: true });
    };
  },
}));

export const selectNews = (s) => s.news;
export const selectNewsLoading = (s) => s.loading;
export const selectCommentCounts = (s) => s.commentCounts;

export default useNewsStore;
