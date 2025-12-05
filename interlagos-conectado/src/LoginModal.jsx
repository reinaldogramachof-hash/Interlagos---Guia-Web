import React, { useState } from 'react';
import { X, LogIn, Shield, Store, User, Database } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';
import { useAuth } from './context/AuthContext';

export default function LoginModal({ onClose, onSuccess }) {
    const { loginAsDev } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (onSuccess) onSuccess(result.user);
            onClose();
        } catch (err) {
            console.error("Erro no login Google:", err);
            setError("Não foi possível fazer login com o Google. Tente novamente.");
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
            setError("E-mail ou senha incorretos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleDevLogin = (role) => {
        loginAsDev(role);
        if (onSuccess) onSuccess({ uid: `dev_${role}`, displayName: `Dev ${role}` }); // Mock user for callback
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-indigo-600 p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                        <LogIn className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Bem-vindo!</h2>
                    <p className="text-indigo-100 text-sm">Faça login para acessar recursos exclusivos.</p>
                </div>

                {/* Body */}
                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-indigo-600 rounded-full animate-spin" />
                        ) : (
                            <>
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                Continuar com Google
                            </>
                        )}
                    </button>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">ou entre com e-mail</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Email Login Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Seu e-mail"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Sua senha"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={onClose}
                            className="text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors"
                        >
                            Continuar como Visitante
                        </button>
                    </div>

                    {/* Dev Mode Section */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 text-center mb-3 uppercase tracking-wider">Modo Desenvolvedor (Teste)</p>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => handleDevLogin('master')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Database size={16} /></div>
                                <span className="text-[10px] font-bold text-gray-500">Master</span>
                            </button>
                            <button onClick={() => handleDevLogin('admin')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Shield size={16} /></div>
                                <span className="text-[10px] font-bold text-gray-500">Admin</span>
                            </button>
                            <button onClick={() => handleDevLogin('merchant')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Store size={16} /></div>
                                <span className="text-[10px] font-bold text-gray-500">Loja</span>
                            </button>
                            <button onClick={() => handleDevLogin('resident')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><User size={16} /></div>
                                <span className="text-[10px] font-bold text-gray-500">User</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">
                        Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                    </p>
                </div>
            </div>
        </div>
    );
}
