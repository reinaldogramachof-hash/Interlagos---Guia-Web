import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, ThumbsUp, AlertCircle, Lightbulb, Loader2, ChevronUp } from 'lucide-react';
import { createSuggestion, fetchSuggestions, voteSuggestion } from '../../../../services/communityService';
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
        title: f.type.value,
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
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lightbulb size={24} className="text-emerald-600" /> Caixa de Sugestões
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Participe da melhoria do nosso bairro com suas ideias e sugestões.</p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-xl text-center">
          <ThumbsUp size={32} className="text-emerald-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-emerald-100 mb-1">Obrigado pela sugestão!</h3>
          <p className="text-sm text-emerald-800 dark:text-emerald-200 opacity-80 mb-4 max-w-sm mx-auto">Sua opinião é fundamental para construirmos um Bairro cada vez melhor.</p>
          <button onClick={() => setSubmitted(false)} className="text-sm border border-emerald-600 text-emerald-600 bg-white dark:bg-emerald-900/50 font-bold px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-colors">
            Enviar outra sugestão
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de Mensagem</label>
            <div className="grid grid-cols-3 gap-3">
              {[{ val: 'Ideia', icon: Lightbulb, color: 'text-yellow-500' }, { val: 'Problema', icon: AlertCircle, color: 'text-red-500' }, { val: 'Outro', icon: MessageSquare, color: 'text-emerald-500' }].map(t => (
                <label key={t.val} className="cursor-pointer">
                  <input type="radio" name="type" value={t.val} className="peer sr-only" defaultChecked={t.val === 'Ideia'} />
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/30 transition-all">
                    <t.icon className={`mb-1 ${t.color}`} size={20} />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">{t.val}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <textarea name="message" required rows="3" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Conte sua ideia..." />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 shadow-lg shadow-emerald-600/20">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Enviar Sugestão
          </button>
        </form>
      )}

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-emerald-600" /> Sugestões da Comunidade
        </h3>
        {loadingSuggestions ? (
          <div className="flex justify-center py-6"><Loader2 className="animate-spin text-emerald-600" size={24} /></div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 text-sm">Nenhuma sugestão ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${s.title === 'Ideia' ? 'bg-yellow-100 text-yellow-700' : s.title === 'Problema' ? 'bg-red-100 text-red-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(s.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{s.description}</p>
                </div>
                <button onClick={() => handleVote(s.id)} disabled={votedIds.has(s.id)} className={`flex flex-col items-center gap-0.5 p-2 rounded-xl h-fit transition-all ${votedIds.has(s.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600'}`}>
                  <ChevronUp size={20} strokeWidth={3} />
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
