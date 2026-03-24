import { useState } from 'react';
import { CheckCircle, User, FileText, MapPin, ArrowRight } from 'lucide-react';
import { recordConsent } from '../../services/consentService';
import { updateUserProfile } from '../../services/authService';
import useAuthStore from '../../stores/authStore';

// ── Passo 1: Termos ───────────────────────────────────────────────────────────
function StepTerms({ onNext }) {
  const [termsOk, setTermsOk] = useState(false);
  const [privacyOk, setPrivacyOk] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base">Termos e Privacidade</h3>
          <p className="text-xs text-slate-500">Leia antes de continuar</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 space-y-2 border border-slate-100">
        <p className="font-semibold text-slate-700">Resumo dos Termos de Uso:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Você é responsável pelo conteúdo que publica</li>
          <li>Respeite os demais moradores e comerciantes</li>
          <li>Conteúdo falso ou ofensivo pode resultar em suspensão</li>
          <li>A plataforma é gratuita para moradores</li>
        </ul>
        <p className="font-semibold text-slate-700 pt-2">Política de Privacidade:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Seus dados são armazenados com segurança no Supabase</li>
          <li>Não compartilhamos seus dados com terceiros sem consentimento</li>
          <li>Você pode solicitar exclusão da conta a qualquer momento</li>
        </ul>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={termsOk}
            onChange={e => setTermsOk(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0"
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            Li e aceito os <span className="font-semibold text-indigo-600">Termos de Uso</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={privacyOk}
            onChange={e => setPrivacyOk(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0"
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            Li e aceito a <span className="font-semibold text-indigo-600">Política de Privacidade</span>
          </span>
        </label>
      </div>

      <button
        onClick={onNext}
        disabled={!termsOk || !privacyOk}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
      >
        Continuar <ArrowRight size={18} />
      </button>
    </div>
  );
}

// ── Passo 2: Dados pessoais ───────────────────────────────────────────────────
const NEIGHBORHOODS = ['Interlagos', 'Parque Residencial Cocaia', 'Jardim Riviera', 'Outro'];

function StepProfile({ onNext }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  const isValid = fullName.trim().length >= 3 && phone.trim().length > 0 && neighborhood;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base">Seus dados</h3>
          <p className="text-xs text-slate-500">Para personalizar sua experiência</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1 block">Nome completo *</label>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            minLength={3}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1 block">Telefone / WhatsApp *</label>
          <input
            type="tel"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1 block">
            <MapPin size={12} className="inline mr-1" />Bairro *
          </label>
          <select
            value={neighborhood}
            onChange={e => setNeighborhood(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm"
          >
            <option value="">Selecione seu bairro</option>
            {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={() => onNext({ fullName: fullName.trim(), phone: phone.trim(), neighborhood })}
        disabled={!isValid}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
      >
        Continuar <ArrowRight size={18} />
      </button>
    </div>
  );
}

// ── Passo 3: Conclusão ────────────────────────────────────────────────────────
function StepDone({ onFinish, saving }) {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="flex justify-center">
        <CheckCircle size={72} className="text-emerald-500" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-black text-slate-800 text-2xl">Tudo pronto!</h3>
        <p className="text-slate-500 text-sm mt-2">
          Bem-vindo ao Tem No Bairro.<br />Explore o melhor do bairro de Interlagos!
        </p>
      </div>
      <button
        onClick={onFinish}
        disabled={saving}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
      >
        {saving ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>Começar a explorar <ArrowRight size={18} /></>
        )}
      </button>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function OnboardingModal({ isOpen, onComplete }) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const [saving, setSaving] = useState(false);
  const session = useAuthStore(s => s.session);

  if (!isOpen) return null;

  const userId = session?.user?.id;

  const handleFinish = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await recordConsent(userId, 'terms_of_use');
      await recordConsent(userId, 'privacy_policy');
      await updateUserProfile(userId, {
        full_name: profileData?.fullName || null,
        neighborhood: profileData?.neighborhood || null,
        onboarding_completed: true,
        terms_accepted_at: new Date().toISOString(),
      });
      onComplete?.();
    } catch (err) {
      console.error('[OnboardingModal] Erro ao finalizar onboarding:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Barra de progresso */}
        <div className="h-1.5 bg-slate-100">
          <div
            className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="px-6 pt-5 pb-3">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Passo {step} de 3
          </p>
        </div>

        <div className="px-6 pb-8">
          {step === 1 && (
            <StepTerms onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepProfile onNext={(data) => { setProfileData(data); setStep(3); }} />
          )}
          {step === 3 && (
            <StepDone onFinish={handleFinish} saving={saving} />
          )}
        </div>
      </div>
    </div>
  );
}
