import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { recordConsent } from '../../services/consentService';
import { useToast } from '../../components/Toast';

/**
 * Modal de responsabilidade exibido antes da criação de notícia
 * por moradores (gate LGPD para news_responsibility).
 *
 * Props:
 *   isOpen      {boolean}
 *   userId      {string}   — UUID do usuário logado
 *   onConfirm   {() => void} — chamado após aceite (abre formulário de criação)
 *   onCancel    {() => void} — fecha sem confirmar
 */
export default function NewsResponsibilityModal({ isOpen, userId, onConfirm, onCancel }) {
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!accepted) return;
    setSaving(true);
    try {
      await recordConsent(userId, 'news_responsibility');
      onConfirm?.();
    } catch (err) {
      console.error('[NewsResponsibilityModal]', err);
      showToast('Erro ao registrar seu consentimento. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-100 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={20} className="text-amber-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm leading-tight">
            Responsabilidade ao Publicar
          </h3>
          <button
            onClick={onCancel}
            className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Ao publicar conteúdo nesta plataforma, você declara que:
          </p>
          <ul className="space-y-2">
            {[
              'O conteúdo é verídico e de sua responsabilidade',
              'Você não viola direitos de terceiros',
              'Conteúdo falso ou ofensivo pode resultar em exclusão da conta e responsabilização legal conforme o Marco Civil da Internet (Lei 12.965/2014)',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <label className="flex items-start gap-3 cursor-pointer group pt-1">
            <input
              type="checkbox"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0"
            />
            <span className="text-xs text-slate-700 group-hover:text-slate-900 font-medium">
              Li, entendi e concordo com as responsabilidades acima
            </span>
          </label>
        </div>

        {/* Ações */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!accepted || saving}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : 'Concordar e continuar'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
