import React, { useState } from 'react';
import { Send, MessageSquare, ThumbsUp, AlertCircle, Lightbulb } from 'lucide-react';

export default function SuggestionsView() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Here you would typically send the data to Firebase
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full text-emerald-600 dark:text-emerald-400 mb-6">
                    <ThumbsUp size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Obrigado pela sugestão!</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                    Sua opinião é fundamental para construirmos um Interlagos cada vez melhor. Nossa equipe irá analisar sua mensagem com carinho.
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
        <div className="animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto pb-20">
            <div className="text-center mb-10">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Seu Nome</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="Como podemos te chamar?"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Seu Email (Opcional)</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="para@contato.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de Mensagem</label>
                    <div className="grid grid-cols-3 gap-3">
                        <label className="cursor-pointer">
                            <input type="radio" name="type" className="peer sr-only" defaultChecked />
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 transition-all">
                                <Lightbulb className="mb-2 text-yellow-500" size={24} />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Ideia</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="type" className="peer sr-only" />
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 transition-all">
                                <AlertCircle className="mb-2 text-red-500" size={24} />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Problema</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="type" className="peer sr-only" />
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
                        required
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                        placeholder="Conte para nós o que você está pensando..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Send size={20} />
                    Enviar Sugestão
                </button>
            </form>
        </div>
    );
}
