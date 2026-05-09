import { useState } from 'react';
import { MessageCircle, Send, User, Wrench, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { createTicket } from '../../services/communityService';
import { useToast } from '../../components/Toast';
import { PageHero, CategoryChips, MobileCard } from '../../components/mobile';

const CATEGORIES = [
  { id: 'ads', label: 'Meu anúncio', icon: Send },
  { id: 'account', label: 'Minha conta', icon: User },
  { id: 'tech', label: 'Problemas técnicos', icon: Wrench },
];

export default function SupportView({ onRequireAuth }) {
  const { currentUser } = useAuth();
  const showToast = useToast();
  const [selectedCategory, setSelectedCategory] = useState('ads');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return onRequireAuth?.();
    if (!subject || !body) return showToast('Preencha todos os campos.', 'warning');

    setSubmitting(true);
    try {
      await createTicket({
        author_id: currentUser.id,
        subject: `[${selectedCategory}] ${subject}`,
        body,
        status: 'open'
      });
      setSubmitted(true);
    } catch (error) {
      showToast('Erro ao abrir chamado.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mobile-page flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in">
        <div className="bg-emerald-100 p-6 rounded-full text-emerald-600 mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Chamado enviado!</h2>
        <p className="text-slate-500 max-w-xs mb-8">Nossa equipe recebeu sua solicitação e responderá em breve via e-mail.</p>
        <button
          onClick={() => { setSubmitted(false); setSubject(''); setBody(''); }}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-pill shadow-card transition-all"
        >
          Abrir outro chamado
        </button>
      </div>
    );
  }

  return (
    <div className="mobile-page animate-in fade-in">
      <PageHero
        section="news"
        title="Suporte"
        subtitle="Como podemos te ajudar hoje?"
        icon={MessageCircle}
        compact
      />

      <form onSubmit={handleSubmit} className="space-y-5 px-4 pt-5 max-w-xl mx-auto">
        {!currentUser && (
          <MobileCard
            onClick={onRequireAuth}
            className="border-brand-100 bg-brand-50"
            bodyClassName="flex items-center gap-3 text-brand-700"
          >
            <User size={20} />
            <span className="text-sm font-bold text-brand-700">Faça login para abrir um chamado</span>
          </MobileCard>
        )}

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700">Categoria</label>
          <CategoryChips
            items={CATEGORIES}
            value={selectedCategory}
            onChange={setSelectedCategory}
            section="news"
            getId={(item) => item.id}
            getLabel={(item) => item.label}
            getIcon={(item) => item.icon}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Assunto</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 shadow-sm"
            placeholder="Ex: Problema no pagamento"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Mensagem detalhada</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none resize-none text-slate-900 shadow-sm"
            rows={5}
            placeholder="Descreva o que aconteceu..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-pill shadow-card transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          {submitting ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </form>
    </div>
  );
}
