import { useState, useEffect } from 'react';
import { X, LogIn, Eye, EyeOff, Lock, Mail, User, Shield, Send } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { useScrollLock } from '../../hooks/useScrollLock';

export default function LoginModal({ onClose, onSuccess }) {
  useScrollLock(true);

  const [loginType, setLoginType]       = useState('resident');
  const [mode, setMode]                 = useState('password'); // 'password' | 'magic'
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [magicSent, setMagicSent]       = useState(false);

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { signInWithGoogle, signInWithMagicLink, signInWithPassword } = useAuthStore();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // Supabase OAuth redireciona — onSuccess chamado após redirect
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Erro ao conectar com Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithMagicLink(email);
      setMagicSent(true);
    } catch (err) {
      setError('Erro ao enviar link. Verifique o e-mail.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithPassword(email, password);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message?.includes('Invalid login') ? 'Credenciais inválidas.' : 'Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />;

  const TermsCheckbox = () => (
    <label className="flex items-start gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={termsAccepted}
        onChange={e => setTermsAccepted(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0"
      />
      <span className="text-xs text-slate-500 group-hover:text-slate-700 leading-relaxed">
        Li e aceito os{' '}
        <span className="font-semibold text-indigo-600">Termos de Uso</span>
        {' '}e a{' '}
        <span className="font-semibold text-indigo-600">Política de Privacidade</span>
      </span>
    </label>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className={`bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20 relative ${loginType === 'partner' ? 'ring-4 ring-slate-900/10' : ''}`}>

        <button onClick={() => { setTermsAccepted(false); onClose(); }} className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 w-8 h-8 rounded-full flex items-center justify-center transition-all">
          <X size={18} />
        </button>

        {/* Header */}
        <div className={`relative px-6 pt-10 pb-16 transition-colors duration-500 ${loginType === 'partner' ? 'bg-slate-900' : 'bg-indigo-600'}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.5)_1px,transparent_0)] bg-[size:20px_20px]" />
          <div className="relative z-10 text-center">
            <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3 transition-all duration-500 ${loginType === 'partner' ? 'bg-indigo-500 text-white rotate-0' : 'bg-white text-indigo-600'}`}>
              {loginType === 'partner' ? <Shield size={40} /> : <User size={40} />}
            </div>
            <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">
              {loginType === 'partner' ? 'Área Restrita' : 'Bem-vindo!'}
            </h2>
            <p className={`text-sm font-medium ${loginType === 'partner' ? 'text-slate-400' : 'text-indigo-100'}`}>
              {loginType === 'partner' ? 'Acesso exclusivo para Gestores' : 'Entre para explorar o Melhor do Bairro'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative -mt-8 px-8 mb-6">
          <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-100 flex">
            <button onClick={() => { setLoginType('resident'); setError(''); setMagicSent(false); setTermsAccepted(false); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${loginType === 'resident' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <User size={14} /> Morador
            </button>
            <button onClick={() => { setLoginType('partner'); setError(''); setMagicSent(false); setMode('password'); setTermsAccepted(false); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${loginType === 'partner' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <Shield size={14} /> Parceiro
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl mb-6 flex items-center gap-2 animate-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {error}
            </div>
          )}

          {/* Moradores: Google + Magic Link */}
          {loginType === 'resident' && (
            <div className="space-y-4">
              {magicSent ? (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-center">
                  <Send size={24} className="mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-sm">Link enviado!</p>
                  <p className="text-xs mt-1">Verifique sua caixa de entrada em <strong>{email}</strong>.</p>
                </div>
              ) : (
                <>
                  <TermsCheckbox />

                  <button onClick={handleGoogleLogin} disabled={loading || !termsAccepted} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <Spinner /> : <><img src="/google-logo.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" /> Entrar com Google</>}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-100" />
                    <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-wider">ou receba um link mágico</span>
                    <div className="flex-grow border-t border-slate-100" />
                  </div>

                  <form onSubmit={handleMagicLink} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                      <input type="email" placeholder="seu@email.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={loading || !termsAccepted} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                      {loading ? <Spinner /> : <><Send size={18} /> Enviar Link Mágico</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* Parceiros: Email + Senha */}
          {loginType === 'partner' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input type="email" placeholder="admin@interlagos.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <TermsCheckbox />
              <button type="submit" disabled={loading || !termsAccepted} className="w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20">
                {loading ? <Spinner /> : <><Shield size={18} /> Acessar Painel</>}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">Versão Beta 2.0</p>
        </div>
      </div>
    </div>
  );
}
