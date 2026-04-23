import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { getApprovedReviews, createReview } from '../../../services/merchantReviewsService';
import useAuthStore from '../../../stores/authStore';
import useUiStore from '../../../stores/uiStore';
import { useToast } from '../../../components/Toast';

export function StoreReviews({ merchant, storeColor, planConfig }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { session, profile } = useAuthStore();
  const user = session?.user ?? null;
  const setIsLoginOpen = useUiStore(state => state.setIsLoginOpen);
  const average = merchant.avg_rating ?? 0;
  const count = merchant.review_count ?? 0;
  const showToast = useToast();

  useEffect(() => {
    let mounted = true;
    async function loadReviews() {
      if (!planConfig?.hasStoreReviews) return;
      const revs = await getApprovedReviews(merchant.id);
      if (mounted) {
        setReviews(revs);
        setLoading(false);
      }
    }
    loadReviews();
    return () => { mounted = false; };
  }, [merchant.id, planConfig]);

  if (!planConfig?.hasStoreReviews) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !profile) {
      showToast('Faça login para avaliar', 'error');
      return;
    }
    if (rating === 0) {
      showToast('Selecione uma nota de 1 a 5', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const newReview = await createReview({
        merchantId: merchant.id,
        authorId: user.id,
        authorName: profile.full_name || 'Usuário',
        neighborhood: import.meta.env.VITE_NEIGHBORHOOD,
        rating,
        comment: comment.trim()
      });
      showToast('Avaliação publicada!', 'success');
      setReviews(prev => [newReview, ...prev]);
      setShowForm(false);
      setHasSubmitted(true);
      setRating(0);
      setComment('');
    } catch (err) {
      showToast(err.message || 'Erro ao enviar avaliação', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-4 mb-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center justify-center min-h-[100px]">
        <div className="animate-pulse flex gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-4 mb-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${storeColor}15`, color: storeColor }}>
              <MessageSquare size={15} />
            </span>
            Avaliações
          </h3>
          {count > 0 && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1 font-medium">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              {average.toFixed(1)} <span className="text-gray-400 ml-1">· {count} {count === 1 ? 'avaliação' : 'avaliações'}</span>
            </p>
          )}
        </div>
        {hasSubmitted ? (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            Avaliação publicada ✓
          </span>
        ) : (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors"
            style={{ color: storeColor, borderColor: storeColor }}
          >
            {showForm ? 'Cancelar' : 'Deixar avaliação'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          {!user ? (
            <div className="text-center py-2">
              <p className="text-sm text-gray-600 mb-3">Faça login para deixar sua avaliação.</p>
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="text-sm font-bold text-white px-4 py-2 rounded-lg"
                style={{ background: storeColor }}
              >
                Fazer Login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">Sua nota</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`transition-colors ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">Comentário (opcional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 280))}
                  placeholder="Conte-nos sobre sua experiência..."
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 bg-white resize-none"
                  style={{ '--tw-ring-color': storeColor }}
                  rows={3}
                />
                <div className="text-right text-[10px] text-gray-400 mt-1">{comment.length}/280</div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full text-sm font-bold text-white py-2.5 rounded-xl transition-transform active:scale-[0.98] disabled:opacity-70 flex justify-center"
                style={{ background: storeColor }}
              >
                {submitting ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </>
          )}
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          Ainda não há avaliações para esta loja.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {review.author_name ? review.author_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{review.author_name || 'Usuário'}</span>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 mt-2 pl-8">{review.comment}</p>
              )}
              <p className="text-[10px] text-gray-400 pl-8 mt-1">
                {new Date(review.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
