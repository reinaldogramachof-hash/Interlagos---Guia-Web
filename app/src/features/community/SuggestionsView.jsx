import { useState, useEffect } from 'react';
import { Send, MessageSquare, ThumbsUp, AlertCircle, Lightbulb, User, Loader2, ChevronUp } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { createSuggestion, fetchSuggestions, voteSuggestion } from '../../services/communityService';
import { useToast } from '../../components/Toast';
import { PageHero, MobileCard, SectionHeader } from '../../components/mobile';

const SUGGESTION_TYPES = [
  { val: 'Ideia', icon: Lightbulb, color: 'text-yellow-500' },
  { val: 'Problema', icon: AlertCircle, color: 'text-red-500' },
  { val: 'Outro', icon: MessageSquare, color: 'text-emerald-500' },
];

export default function SuggestionsView({ onRequireAuth }) {
  const { currentUser } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [votedIds, setVotedIds] = useState(new Set());
  const showToast = useToast();

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const data = await fetchSuggestions();
      setSuggestions(data || []);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return onRequireAuth?.();

    setIsSubmitting(true);
    const f = e.target;
    try {
      await createSuggestion({
        title: f.type.value,
        description: f.message.value,
        author_id: currentUser.id,
        neighborhood: import.meta.env.VITE_NEIGHBORHOOD,
        status: 'pending'
      });
      setSubmitted(true);
      loadSuggestions();
    } catch (error) {
      showToast('Erro ao enviar sugestão.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (id) => {
    if (!currentUser) return onRequireAuth?.();
    if (votedIds.has(id)) return;

    try {
      await voteSuggestion(id);
      setVotedIds(prev => new Set(prev).add(id));
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, votes: (s.votes || 0) + 1 } : s));
    } catch (error) {
      showToast('Erro ao computar voto.', 'error');
    }
  };

  if (submitted) {
    return (
      <div className="mobile-page flex min-h-[70vh] flex-col items-center justify-center px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600">
          <ThumbsUp size={48} aria-hidden="true" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Obrigado pela sugestão!</h2>
        <p className="max-w-md text-slate-600">Sua opinião é fundamental para construirmos um bairro cada vez melhor.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 rounded-full px-4 py-2 text-sm font-bold text-brand-600 active:bg-brand-50">
          Enviar outra sugestão
        </button>
      </div>
    );
  }

  return (
    <div className="mobile-page bg-gray-50 pb-24 animate-in fade-in slide-in-from-bottom-4">
      <div className="sticky top-14 z-20 mobile-sticky-panel pb-2 shadow-sm">
        <PageHero
          section="campaigns"
          title="Caixa de Sugestões"
          subtitle="Ideias para melhorar o bairro"
          icon={Lightbulb}
          compact
        />
      </div>

      <form onSubmit={handleSubmit} className="mx-3 mt-4 mb-6 space-y-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        {!currentUser && (
          <button type="button" onClick={onRequireAuth} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl bg-brand-50 p-3 text-left text-brand-700">
            <User size={20} aria-hidden="true" />
            <span className="text-sm font-bold">Faça login para sugerir</span>
          </button>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Tipo de mensagem</label>
          <div className="grid grid-cols-3 gap-3">
            {SUGGESTION_TYPES.map(({ val, icon: Icon, color }) => (
              <label key={val} className="cursor-pointer">
                <input type="radio" name="type" value={val} className="peer sr-only" defaultChecked={val === 'Ideia'} />
                <div className="flex min-h-[76px] flex-col items-center justify-center rounded-xl border-2 border-transparent bg-slate-50 p-3 transition-all peer-checked:border-brand-500 peer-checked:bg-brand-50">
                  <Icon className={`mb-1 ${color}`} size={20} aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{val}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <textarea name="message" required rows="4" className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition-all focus:ring-2 focus:ring-brand-500 md:text-sm" placeholder="Conte sua ideia..." />
        </div>

        <button type="submit" disabled={isSubmitting} className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-70">
          <Send size={18} aria-hidden="true" />
          {isSubmitting ? 'Enviando...' : 'Enviar sugestão'}
        </button>
      </form>

      <section>
        <SectionHeader
          title="Sugestões da comunidade"
          subtitle={`${suggestions.length} sugestão${suggestions.length !== 1 ? 's' : ''}`}
        />

        {loadingSuggestions ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-brand-600" size={32} aria-hidden="true" />
          </div>
        ) : suggestions.length === 0 ? (
          <div className="mx-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-12 text-center">
            <MessageSquare className="mx-auto mb-3 text-slate-300" size={36} aria-hidden="true" />
            <p className="text-sm text-slate-500">Nenhuma sugestão ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-3 px-3">
            {suggestions.map(s => (
              <MobileCard key={s.id} bodyClassName="flex gap-4 items-start p-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      s.title === 'Ideia' ? 'bg-yellow-100 text-yellow-700' :
                      s.title === 'Problema' ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-600'
                    }`}>
                      {s.title}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(s.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-700">{s.description}</p>
                </div>
                <button
                  onClick={() => handleVote(s.id)}
                  disabled={votedIds.has(s.id)}
                  className={`flex min-h-[48px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl p-2 transition-all ${
                    votedIds.has(s.id) ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400 hover:bg-brand-50 hover:text-brand-600'
                  }`}
                  aria-label="Votar na sugestão"
                >
                  <ChevronUp size={20} strokeWidth={3} aria-hidden="true" />
                  <span className="text-xs font-black leading-none">{s.votes || 0}</span>
                </button>
              </MobileCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
