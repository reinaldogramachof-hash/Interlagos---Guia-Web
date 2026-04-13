import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { recordConsent } from '../../services/consentService';
import { useToast } from '../../components/Toast';

/**
 * Modal de responsabilidade exibido antes da criação de notícia
 * por moradores (gate LGPD para news_responsibility).
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
      console.error('NewsResponsibilityModal.handleConfirm error:', err);
      showToast('Erro ao registrar consentimento.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={18} className="text-amber-600" />
          </div>
          <h3 className="font-black text-slate-800 text-[13px] tracking-tight">
            Aviso de Responsabilidade
          </h3>
          <button onClick={onCancel} className="ml-auto text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Corpo - Rolável se necessário */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
            Para manter a veracidade das informações no bairro, ao publicar você concorda que:
          </p>
          <ul className="space-y-2.5">
            {[
              'O conteúdo é real e de sua inteira responsabilidade',
              'Não viola direitos de imagem ou privacidade de terceiros',
              'Fake news ou ofensas resultarão em suspensão imediata e medidas legais (Lei 12.965/2014)',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[11px] text-slate-600 leading-snug">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all">
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-amber-600 flex-shrink-0 cursor-pointer"
              />
              <span className="text-[11px] text-slate-700 group-hover:text-slate-900 font-black leading-tight">
                Entendo e aceito as responsabilidades acima
              </span>
            </label>
          </div>
        </div>

        {/* Ações */}
        <div className="px-5 pb-5 shrink-0 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 font-black text-[11px] hover:bg-slate-50 uppercase tracking-widest transition-all"
          >
            Sair
          </button>
          <button
            onClick={handleConfirm}
            disabled={!accepted || saving}
            className={`flex-1 py-3 rounded-xl font-black text-[11px] flex items-center justify-center gap-2 uppercase tracking-widest transition-all ${
              !accepted || saving
                ? 'bg-slate-100 text-slate-400'
                : 'bg-amber-600 text-white shadow-lg shadow-amber-600/20 active:scale-95'
            }`}
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : 'Concordar'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
