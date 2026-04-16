import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, ThumbsUp, AlertCircle, Lightbulb, Loader2, ChevronUp, MapPin, Tag } from 'lucide-react';
import { createSuggestion, fetchSuggestions, voteSuggestion, SUGGESTION_CATEGORIES } from '../../../../services/communityService';
import { useToast } from '../../../../components/Toast';

export default function SuggestionsTab({ currentUser }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [votedIds, setVotedIds] = useState(new Set());
  const showToast = useToast();

  useEffect(() => { loadSuggestions(); }, []);

  const loadSuggestions = async () => {
    try {
      const data = await fetchSuggestions();
      setSuggestions(data || []);
    } finally { setLoadingSuggestions(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const f = e.target;
    try {
      await createSuggestion({
        title: f.category.value,
        description: f.message.value,
        author_id: currentUser.id || currentUser.uid,
        neighborhood: import.meta.env.VITE_NEIGHBORHOOD,
        status: 'pending'
      });
      setSubmitted(true);
      loadSuggestions();
    } catch { showToast('Erro ao enviar sugestão.', 'error'); } 
    finally { setIsSubmitting(false); }
  };

  const handleVote = async (id) => {
    if (votedIds.has(id)) return;
    try {
      await voteSuggestion(id);
      setVotedIds(prev => new Set(prev).add(id));
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, votes: (s.votes || 0) + 1 } : s));
    } catch { showToast('Erro ao computar voto.', 'error'); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb size={24} className="text-amber-500" /> Caixa de Sugestões
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Sua ideia pode virar uma melhoria real no bairro!</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-800">
          <p className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1">
            <Tag size={10} /> {suggestions.length} Sugestões
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-8 rounded-2xl text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp size={32} className="text-emerald-600" />
          </div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-emerald-100 mb-2">Sugestão Enviada!</h3>
          <p className="text-sm text-emerald-800 dark:text-emerald-200 opacity-80 mb-6 max-w-sm mx-auto">Sua contribuição já está visível para a comunidade. Se ela ganhar força, a administração abrirá uma enquete!</p>
          <button onClick={() => setSubmitted(false)} className="text-sm bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 mx-auto">
            Enviar outra ideia
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Sobre qual tema é sua sugestão?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {SUGGESTION_CATEGORIES.map((cat, i) => (
                <label key={cat} className="cursor-pointer group">
                  <input type="radio" name="category" value={cat} className="peer sr-only" defaultChecked={i === 0} />
                  <div className="flex items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-900/30 transition-all text-center min-h-[44px]">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-amber-600 peer-checked:text-amber-600 transition-colors uppercase tracking-tighter line-clamp-1">{cat}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Descreva sua ideia</label>
            <textarea name="message" required rows="3" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none shadow-inner" placeholder="Explique como podemos melhorar o bairro..." />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 shadow-xl">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} Enviar Sugestão
          </button>
        </form>
      )}

      <div>
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-amber-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">O que o Bairro está falando</h3>
        </div>
        
        {loadingSuggestions ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="animate-spin text-amber-500 mb-2" size={32} />
            <p className="text-xs text-slate-400 font-medium">Carregando sugestões...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <Lightbulb size={32} className="mx-auto mb-3 text-slate-200" />
            <p className="text-slate-500 text-sm font-medium">Nenhuma sugestão ainda. Inaugure a caixa!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex gap-4 items-start transition-all hover:shadow-md group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(s.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium line-clamp-3">{s.description}</p>
                </div>
                <button 
                  onClick={() => handleVote(s.id)} 
                  disabled={votedIds.has(s.id)} 
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-2xl min-h-[56px] min-w-[56px] transition-all ${votedIds.has(s.id) ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600'}`}
                >
                  <ChevronUp size={24} strokeWidth={3} className={votedIds.has(s.id) ? 'animate-bounce' : ''} />
                  <span className="text-xs font-black leading-none">{s.votes || 0}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
