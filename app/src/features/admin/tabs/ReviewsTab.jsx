import { useState, useEffect } from 'react';
import { Star, Trash2, MessageSquare, RefreshCw } from 'lucide-react';
import { getRecentReviews, rejectReview } from '../../../services/merchantReviewsService';
import { useToast } from '../../../components/Toast';

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
      ))}
    </div>
  );
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const showToast = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await getRecentReviews();
    setReviews(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    setActing(id);
    try {
      await rejectReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('Avaliação removida.', 'success');
    } catch {
      showToast('Erro ao remover', 'error');
    } finally {
      setActing(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-indigo-500" />
        <h2 className="text-base font-black text-slate-900">Gerenciar Avaliações</h2>
        <button onClick={load} className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <RefreshCw size={15} />
        </button>
        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
          {reviews.length}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma avaliação ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{review.merchant_name}</p>
                  <p className="text-xs text-slate-500">
                    por <span className="font-semibold">{review.author_name || 'Usuário'}</span>
                  </p>
                </div>
                <StarRow rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 my-2 line-clamp-3">
                  "{review.comment}"
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-slate-400">
                  {new Date(review.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={acting === review.id}
                  className="h-8 px-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 size={13} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
