import React, { useState } from 'react';
import { Send, MessageSquare, ThumbsUp, AlertCircle, Lightbulb, User } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import LoginModal from './LoginModal';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function SuggestionsView() {
    const { currentUser } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            setShowLogin(true);
            return;
        }

        setIsSubmitting(true);
        const f = e.target;
        try {
            await addDoc(collection(db, 'suggestions'), {
                type: f.type.value,
                message: f.message.value,
                userId: currentUser.uid,
                userName: currentUser.displayName,
                userEmail: currentUser.email,
                createdAt: serverTimestamp(),
                status: 'unread'
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error sending suggestion:", error);
            alert("Erro ao enviar sugestão.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full text-emerald-600 dark:text-emerald-400 mb-6">
                    <ThumbsUp size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Obrigado pela sugestão!</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                    Sua opinião é fundamental para construirmos um Bairro cada vez melhor. Nossa equipe irá analisar sua mensagem com carinho.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                    Enviar outra sugestão
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto pb-20 px-4">
            <div className="text-center mb-10 mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4">
                    <Lightbulb size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Caixa de Sugestões</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Tem uma ideia para o bairro? Viu algo que precisa de conserto?
                    Ou quer apenas elogiar? Este espaço é seu.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">

                {!currentUser && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-center gap-3 text-indigo-800 dark:text-indigo-200 mb-4 cursor-pointer" onClick={() => setShowLogin(true)}>
                        <User size={24} />
                        <span className="text-sm font-bold">Faça login para enviar sua sugestão. Clique aqui.</span>
                    </div>
                )}

                {currentUser && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <img src={currentUser.photoURL} alt="" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.displayName}</p>
                            <p className="text-xs text-slate-500">{currentUser.email}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de Mensagem</label>
                    <div className="grid grid-cols-3 gap-3">
                        <label className="cursor-pointer">
                            <input type="radio" name="type" value="Ideia" className="peer sr-only" defaultChecked />
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 transition-all">
                                <Lightbulb className="mb-2 text-yellow-500" size={24} />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Ideia</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="type" value="Problema" className="peer sr-only" />
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 transition-all">
                                <AlertCircle className="mb-2 text-red-500" size={24} />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Problema</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="type" value="Outro" className="peer sr-only" />
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 transition-all">
                                <MessageSquare className="mb-2 text-emerald-500" size={24} />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Outro</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Sua Mensagem</label>
                    <textarea
                        name="message"
                        required
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                        placeholder="Conte para nós o que você está pensando..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <Send size={20} />
                    {isSubmitting ? 'Enviando...' : 'Enviar Sugestão'}
                </button>
            </form>

            {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />}
        </div>
    );
}
