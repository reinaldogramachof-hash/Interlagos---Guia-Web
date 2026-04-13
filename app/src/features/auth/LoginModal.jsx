import { useState } from 'react';
import { X, LogIn, Eye, EyeOff, Lock, Mail, User, Shield, Send, KeyRound, RefreshCw } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { useScrollLock } from '../../hooks/useScrollLock';

// ── Sub-componente: verificação OTP ─────────────────────────────────────────
function OtpVerification({ email, otpCode, setOtpCode, loading, onVerify, onResend }) {
  return (
    <div className="space-y-5">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 text-center">
        <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <KeyRound size={20} className="text-indigo-600" />
        </div>
        <p className="text-sm font-bold text-slate-800 mb-1">Código enviado!</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          Verifique a caixa de <strong className="text-indigo-700">{email}</strong> e insira o código recebido.
        </p>
      </div>
      <form onSubmit={onVerify} className="space-y-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={8}
          pattern="[0-9]*"
          placeholder="00000000"
          value={otpCode}
          autoFocus
          onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
          className="w-full text-center text-2xl font-black tracking-[0.35em] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
        />
        <button type="submit" disabled={otpCode.length < 6 || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 transition-all">
          {loading
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><LogIn size={18} /> Verificar Código</>}
        </button>
      </form>
      <button onClick={onResend} className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-indigo-600 font-bold transition-colors py-1">
        <RefreshCw size={13} /> Reenviar código
      </button>
    </div>
  );
}

// ── Sub-componente: login por e-mail (OTP send) ──────────────────────────────
function ResidentEmailForm({ email, setEmail, loading, termsAccepted, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
        <input type="email" placeholder="seu@email.com" required value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-base sm:text-sm" />
      </div>
      <button type="submit" disabled={loading || !termsAccepted}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all">
        {loading
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><Send size={18} /> Enviar Código</>}
      </button>
    </form>
  );
}

// ── Sub-componente: login parceiro (email + senha) ────────────────────────────
function PartnerForm({ email, setEmail, password, setPassword, showPassword, setShowPassword, loading, termsAccepted, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">E-mail Corporativo</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input type="email" placeholder="admin@interlagos.com" required value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-base sm:text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">Senha de Acesso</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-base sm:text-sm" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading || !termsAccepted}
        className="w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 transition-all">
        {loading
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><Shield size={18} /> Acessar Painel</>}
      </button>
    </form>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function LoginModal({ onClose, onSuccess }) {
  useScrollLock(true);

  const [loginType, setLoginType]         = useState('resident');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [magicSent, setMagicSent]         = useState(false);
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otpCode, setOtpCode]             = useState('');

  const { signInWithGoogle, signInWithMagicLink, signInWithPassword, verifyOtp } = useAuthStore();

  const handleTabSwitch = (tab) => {
    setLoginType(tab); setError(''); setMagicSent(false); setOtpCode(''); setTermsAccepted(false);
  };

  const handleClose = () => {
    setMagicSent(false); setOtpCode(''); setTermsAccepted(false); onClose();
  };

  const handleGoogleLogin = async () => {
    setLoading(true); setError('');
    try { await signInWithGoogle(); onSuccess?.(); onClose(); }
    catch { setError('Erro ao conectar com Google.'); }
    finally { setLoading(false); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await signInWithMagicLink(email); setMagicSent(true); }
    catch { setError('Erro ao enviar código. Verifique o e-mail.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) return;
    setLoading(true); setError('');
    try { await verifyOtp(email, otpCode); onSuccess?.(); onClose(); }
    catch { setError('Código inválido ou expirado. Tente novamente.'); }
    finally { setLoading(false); }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await signInWithPassword(email, password); onSuccess?.(); onClose(); }
    catch (err) { setError(err.message?.includes('Invalid login') ? 'Credenciais inválidas.' : 'Erro ao entrar. Tente novamente.'); }
    finally { setLoading(false); }
  };

  const TermsCheckbox = () => (
    <label className="flex items-start gap-2 cursor-pointer group">
      <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0" />
      <span className="text-xs text-slate-500 group-hover:text-slate-700 leading-relaxed">
        Li e aceito os <span className="font-semibold text-indigo-600">Termos de Uso</span> e a <span className="font-semibold text-indigo-600">Política de Privacidade</span>
      </span>
    </label>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className={`bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20 relative ${loginType === 'partner' ? 'ring-4 ring-slate-900/10' : ''}`}>

        <button onClick={handleClose} className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 w-8 h-8 rounded-full flex items-center justify-center transition-all">
          <X size={18} />
        </button>

        <div className={`relative px-6 pt-7 pb-12 transition-colors duration-500 ${loginType === 'partner' ? 'bg-slate-900' : 'bg-indigo-600'}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.5)_1px,transparent_0)] bg-[size:20px_20px]" />
          <div className="relative z-10 text-center">
            <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg transform transition-all duration-500 ${loginType === 'partner' ? 'bg-indigo-500 text-white rotate-0' : 'bg-white text-indigo-600 rotate-3'}`}>
              {loginType === 'partner' ? <Shield size={28} /> : <User size={28} />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-0.5 tracking-tight">
              {loginType === 'partner' ? 'Área Restrita' : 'Bem-vindo!'}
            </h2>
            <p className={`text-xs font-medium ${loginType === 'partner' ? 'text-slate-400' : 'text-indigo-100'}`}>
              {loginType === 'partner' ? 'Acesso exclusivo para Gestores' : 'Entre para explorar o Melhor do Bairro'}
            </p>
          </div>
        </div>

        <div className="relative -mt-6 px-6 mb-4">
          <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-100 flex">
            <button onClick={() => handleTabSwitch('resident')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${loginType === 'resident' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <User size={14} /> Morador
            </button>
            <button onClick={() => handleTabSwitch('partner')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${loginType === 'partner' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <Shield size={14} /> Parceiro
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl mb-5 flex items-center gap-2 animate-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {error}
            </div>
          )}

          {loginType === 'resident' && (
            <div className="space-y-4">
              {magicSent ? (
                <OtpVerification email={email} otpCode={otpCode} setOtpCode={setOtpCode}
                  loading={loading} onVerify={handleVerifyOtp}
                  onResend={() => { setMagicSent(false); setOtpCode(''); setError(''); }} />
              ) : (
                <>
                  <TermsCheckbox />
                  <button onClick={handleGoogleLogin} disabled={loading || !termsAccepted}
                    className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /> : <><span className="w-5 h-5 flex items-center justify-center font-black text-blue-500 text-lg leading-none group-hover:scale-110 transition-transform">G</span> Entrar com Google</>}
                  </button>
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-100" />
                    <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-wider">ou entre com código</span>
                    <div className="flex-grow border-t border-slate-100" />
                  </div>
                  <ResidentEmailForm email={email} setEmail={setEmail} loading={loading} termsAccepted={termsAccepted} onSubmit={handleSendOtp} />
                </>
              )}
            </div>
          )}

          {loginType === 'partner' && (
            <PartnerForm email={email} setEmail={setEmail} password={password} setPassword={setPassword}
              showPassword={showPassword} setShowPassword={setShowPassword}
              loading={loading} termsAccepted={termsAccepted} onSubmit={handlePasswordLogin} />
          )}

          <p className="mt-5 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">Versão Beta 2.0</p>
        </div>
      </div>
    </div>
  );
}
