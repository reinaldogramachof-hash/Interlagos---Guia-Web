import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Trash2, LogIn, Loader2 } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { fetchComments, createComment, deleteComment } from '../../services/newsService';
import { useToast } from '../../components/Toast';

const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;

function CommentAvatar({ name, photoUrl }) {
  if (photoUrl) return <img src={photoUrl} loading="lazy" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt={name} />;
  const colors = ['bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700'];
  const idx = (name?.charCodeAt(0) ?? 0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colors[idx]}`}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function NewsComments({ newsId }) {
  const [comments, setComments]       = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [content, setContent]         = useState('');
  const inputRef = useRef(null);

  // ── Seletores primitivos para evitar loop infinito com useSyncExternalStore ──
  const userId          = useAuthStore(s => s.session?.user?.id ?? null);
  const userDisplayName = useAuthStore(s => s.profile?.display_name || s.session?.user?.email?.split('@')[0] || null);
  const userPhotoURL    = useAuthStore(s => s.profile?.photo_url ?? null);
  const isAdmin         = useAuthStore(s => s.profile?.role === 'admin' || s.profile?.role === 'master');

  const { requireAuth } = useRequireAuth();
  const showToast = useToast();

  useEffect(() => {
    if (!newsId) return;
    setLoading(true);
    fetchComments(newsId)
      .then(data => setComments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [newsId]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!content.trim() || !userId || submitting) return;

    setSubmitting(true);
    try {
      const newComment = await createComment({
        newsId,
        authorId: userId,
        content: content.trim(),
        neighborhood: NEIGHBORHOOD,
      });

      const optimistic = {
        ...newComment,
        profiles: { display_name: userDisplayName, photo_url: userPhotoURL },
      };

      setComments(prev => [...prev, optimistic]);
      setVisibleCount(prev => prev + 1);
      setContent('');
      showToast('Comentário enviado!', 'success');
    } catch {
      showToast('Erro ao enviar.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch {
      showToast('Erro ao remover.', 'error');
    }
  };

  const visibleComments = comments.slice(-visibleCount);
  const hiddenCount = comments.length - visibleCount;

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 size={20} className="animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <MessageCircle size={16} />
        Comentários ({comments.length})
      </div>

      {hiddenCount > 0 && (
        <button
          onClick={() => setVisibleCount(prev => prev + 10)}
          className="w-full py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
        >
          Ver mais {Math.min(10, hiddenCount)} comentários anteriores
        </button>
      )}

      <div className="space-y-3">
        {visibleComments.map(c => (
          <div key={c.id} className="flex gap-3">
            <CommentAvatar name={c.profiles?.display_name} photoUrl={c.profiles?.photo_url} />
            <div className="flex-1 bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {c.profiles?.display_name || 'Morador'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{timeAgo(c.created_at)}</span>
                  {(c.author_id === userId || isAdmin) && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                      aria-label="Remover comentário"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-4 italic">Seja o primeiro a comentar!</p>
        )}
      </div>

      <div className="pt-1">
        {!userId ? (
          <button
            onClick={() => requireAuth(() => inputRef.current?.focus())}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all"
          >
            <LogIn size={15} /> Entre para comentar →
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Escreva um comentário..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none resize-none transition-all"
            />
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-600 disabled:text-slate-300 transition-colors"
            >
              {submitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
