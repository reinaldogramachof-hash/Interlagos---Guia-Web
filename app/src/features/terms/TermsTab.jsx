import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import { TERMS_ARTICLES, TERMS_VERSION } from './termsContent';
import { hasAcceptedCurrentTerms, recordTermsAcceptance } from '../../services/consentService';
import useAuthStore from '../../stores/authStore';

export default function TermsTab({ onAccepted }) {
  const userId = useAuthStore(s => s.session?.user?.id ?? null);

  const [status, setStatus]     = useState('loading'); // 'loading' | 'pending' | 'accepted'
  const [acceptedAt, setAcceptedAt] = useState(null);
  const [checked, setChecked]   = useState(false);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (!userId) { setStatus('pending'); return; }
    hasAcceptedCurrentTerms(userId)
      .then(accepted => {
        if (accepted) {
          setStatus('accepted');
          setAcceptedAt(new Date().toLocaleDateString('pt-BR'));
        } else {
          setStatus('pending');
        }
      })
      .catch(() => setStatus('pending'));
  }, [userId]);

  const handleAccept = async () => {
    if (!userId || !checked) return;
    setSaving(true);
    try {
      await recordTermsAcceptance(userId);
      setAcceptedAt(new Date().toLocaleDateString('pt-BR'));
      setStatus('accepted');
      onAccepted?.();
    } catch {
      // silencioso — toast opcional
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={28} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500 space-y-6">
        {/* Banner de confirmação — compacto */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
          <CheckCircle size={32} className="text-emerald-500 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="font-bold text-emerald-900 text-sm">Termos aceitos</p>
            {acceptedAt && (
              <p className="text-xs text-emerald-700">Registrado em {acceptedAt}</p>
            )}
            <p className="text-xs text-emerald-500 mt-0.5">Versão: {TERMS_VERSION}</p>
          </div>
        </div>

        {/* Artigos em modo leitura — idênticos ao pending, sem checkbox/botão */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Termos de Uso e Política de Privacidade
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
              Versão 1.0 — Abril/2026
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-[50vh] overflow-y-auto space-y-5">
          {TERMS_ARTICLES.map((art, i) => (
            <div key={i}>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{art.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{art.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={24} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900">Termos de Uso e Política de Privacidade</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            Versão 1.0 — Abril/2026
          </span>
        </div>
      </div>

      {/* Artigos em scroll */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-[50vh] overflow-y-auto space-y-5">
        {TERMS_ARTICLES.map((art, i) => (
          <div key={i}>
            <h4 className="font-bold text-slate-800 text-sm mb-1">{art.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{art.body}</p>
          </div>
        ))}
      </div>

      {/* Declaração */}
      <label className="flex items-start gap-3 cursor-pointer group p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
          className="mt-0.5 w-5 h-5 accent-indigo-600 flex-shrink-0"
        />
        <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">
          Declaro que li e compreendi integralmente os Termos de Uso e a Política de Privacidade acima,
          e me comprometo a utilizá-los de forma consciente e responsável.
        </span>
      </label>

      {/* Botão */}
      <button
        onClick={handleAccept}
        disabled={!checked || saving || !userId}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
      >
        {saving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <CheckCircle size={18} />
            Registrar Ciência e Aceite
          </>
        )}
      </button>
    </div>
  );
}
