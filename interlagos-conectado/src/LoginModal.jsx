import React, { useState } from 'react';
import { X, LogIn, Shield, Store, User, Database, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';
import { useAuth } from './context/AuthContext';

export default function LoginModal({ onClose, onSuccess }) {
    const { loginAsDev } = useAuth();
    const [loginType, setLoginType] = useState('resident'); // 'resident' or 'partner'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDevMode, setShowDevMode] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (onSuccess) onSuccess(result.user);
            onClose();
        } catch (err) {
            console.error("Erro no login Google:", err);
            setError("Erro ao conectar com Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            if (onSuccess) onSuccess(result.user);
            onClose();
        } catch (err) {
            console.error("Erro no login Email:", err);
            setError(err.code === 'auth/invalid-credential' ? "Credenciais inválidas." : "Erro ao entrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleDevLogin = (role) => {
        loginAsDev(role);
        if (onSuccess) onSuccess({ uid: `dev_${role}`, displayName: `Dev ${role}` });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className={`bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-white/20 relative ${loginType === 'partner' ? 'ring-4 ring-slate-900/10' : ''}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                >
                    <X size={18} />
                </button>

                {/* Dynamic Header */}
                <div className={`relative px-6 pt-10 pb-16 transition-colors duration-500 ease-in-out ${loginType === 'partner' ? 'bg-slate-900' : 'bg-indigo-600'}`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
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

                {/* Tab Switcher (Floating) */}
                <div className="relative -mt-8 px-8 mb-6">
                    <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-100 flex">
                        <button
                            onClick={() => { setLoginType('resident'); setError(''); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${loginType === 'resident' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <User size={14} /> Morador
                        </button>
                        <button
                            onClick={() => { setLoginType('partner'); setError(''); }}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${loginType === 'partner' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Shield size={14} /> Parceiro
                        </button>
                    </div>
                </div>

                {/* Authorization Body */}
                <div className="px-8 pb-8">

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-xl mb-6 flex items-center gap-2 animate-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {error}
                        </div>
                    )}

                    {loginType === 'resident' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all mb-6 group"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Entrar com Google
                                    </>
                                )}
                            </button>

                            <div className="relative flex py-2 items-center mb-6">
                                <div className="flex-grow border-t border-slate-100"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-wider">ou use seu e-mail</span>
                                <div className="flex-grow border-t border-slate-100"></div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleEmailLogin} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="space-y-1">
                            {loginType === 'partner' && <label className="text-xs font-bold text-slate-500 ml-1">E-mail Corporativo</label>}
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder={loginType === 'partner' ? "admin@interlagos.com" : "seu@email.com"}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 transition-all text-sm font-medium placeholder:text-slate-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            {loginType === 'partner' && <label className="text-xs font-bold text-slate-500 ml-1">Senha de Acesso</label>}
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border-slate-200 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-900 transition-all text-sm font-medium placeholder:text-slate-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${loginType === 'partner' ? 'bg-slate-900 hover:bg-black shadow-slate-900/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {loginType === 'partner' ? <Shield size={18} /> : <LogIn size={18} />}
                                    {loginType === 'partner' ? 'Acessar Painel' : 'Entrar na Conta'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Developer Trigger */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setShowDevMode(!showDevMode)}
                            className="text-[10px] text-slate-300 font-bold hover:text-slate-500 transition-colors uppercase tracking-widest"
                        >
                            {showDevMode ? 'Ocultar Ferramentas' : 'Versão Alpha 0.9'}
                        </button>
                    </div>

                    {/* Dev Mode Panel */}
                    {showDevMode && (
                        <div className="mt-4 pt-4 border-t border-dashed border-slate-200 animate-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-4 gap-2">
                                <button onClick={() => handleDevLogin('master')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Database size={12} /></div>
                                    <span className="text-[9px] font-bold text-slate-500">Master</span>
                                </button>
                                <button onClick={() => handleDevLogin('admin')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Shield size={12} /></div>
                                    <span className="text-[9px] font-bold text-slate-500">Admin</span>
                                </button>
                                <button onClick={() => handleDevLogin('merchant')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Store size={12} /></div>
                                    <span className="text-[9px] font-bold text-slate-500">Loja</span>
                                </button>
                                <button onClick={() => handleDevLogin('resident')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><User size={12} /></div>
                                    <span className="text-[9px] font-bold text-slate-500">User</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
