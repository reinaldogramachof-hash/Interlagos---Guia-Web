import { useState, useEffect } from 'react';
import { Send, MessageSquare, ThumbsUp, AlertCircle, Lightbulb, User, Loader2, ChevronUp } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { createSuggestion, fetchSuggestions, voteSuggestion } from '../../services/communityService';
import { useToast } from '../../components/Toast';

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
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in duration-500 px-4">
        <div className="bg-emerald-100 p-6 rounded-full text-emerald-600 mb-6">
          <ThumbsUp size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Obrigado pela sugestão!</h2>
        <p className="text-slate-600 max-w-md">Sua opinião é fundamental para construirmos um Bairro cada vez melhor.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-brand-600 font-bold hover:underline">
          Enviar outra sugestão
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto pb-20 px-4">
      <div className="text-center mb-10 mt-6">
        <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-card text-brand-600 mb-4">
          <Lightbulb size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Caixa de Sugestões</h2>
        <p className="text-slate-600">Participe da melhoria do nosso bairro com suas ideias e sugestões.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-card border border-slate-100 shadow-card mb-12">
        {!currentUser && (
          <div onClick={onRequireAuth} className="bg-brand-50 p-4 rounded-xl flex items-center gap-3 text-brand-700 cursor-pointer">
            <User size={20} />
            <span className="text-sm font-bold">Faça login para sugerir</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Tipo de Mensagem</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'Ideia', icon: Lightbulb, color: 'text-yellow-500' },
              { val: 'Problema', icon: AlertCircle, color: 'text-red-500' },
              { val: 'Outro', icon: MessageSquare, color: 'text-emerald-500' }
            ].map(t => (
              <label key={t.val} className="cursor-pointer">
                <input type="radio" name="type" value={t.val} className="peer sr-only" defaultChecked={t.val === 'Ideia'} />
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border-2 border-transparent peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all">
                  <t.icon className={`mb-1 ${t.color}`} size={20} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{t.val}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <textarea name="message" required rows="3" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none text-sm" placeholder="Conte sua ideia..." />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-card transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
          <Send size={18} />
          {isSubmitting ? 'Enviando...' : 'Enviar Sugestão'}
        </button>
      </form>

      <section>
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-brand-600" />
          Sugestões da Comunidade
        </h3>

        {loadingSuggestions ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-600" size={32} /></div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-card border-2 border-dashed border-slate-200">
            <p className="text-slate-500">Nenhuma sugestão ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map(s => (
              <div key={s.id} className="bg-white p-5 rounded-card border border-slate-100 shadow-sm flex gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase ${
                      s.title === 'Ideia' ? 'bg-yellow-100 text-yellow-700' : 
                      s.title === 'Problema' ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-600'
                    }`}>
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(s.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">{s.description}</p>
                </div>
                <button 
                  onClick={() => handleVote(s.id)}
                  disabled={votedIds.has(s.id)}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${
                    votedIds.has(s.id) ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400 hover:bg-brand-50 hover:text-brand-600'
                  }`}
                >
                  <ChevronUp size={20} strokeWidth={3} />
                  <span className="text-xs font-black leading-none">{s.votes || 0}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
