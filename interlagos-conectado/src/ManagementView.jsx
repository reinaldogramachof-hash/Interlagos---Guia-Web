import React from 'react';
import { Mail, Phone, Globe, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ManagementView() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-20">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl text-white mb-6 shadow-lg shadow-indigo-500/30">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Gestão & Transparência</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Conheça a equipe dedicada a manter o Guia Digital Interlagos sempre atualizado e relevante para a nossa comunidade.
                </p>
            </div>

            {/* Team/Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-colors">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Comunidade</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Nosso foco é fortalecer os laços entre moradores e comerciantes locais, criando uma rede de apoio mútuo.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-colors">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Segurança</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Trabalhamos para divulgar informações confiáveis e úteis que contribuam para a segurança e bem-estar de todos.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-colors">
                    <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                        <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Inovação</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Buscamos constantemente novas tecnologias e soluções para facilitar a vida de quem vive e trabalha em Interlagos.
                    </p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10" />
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-6">Precisa falar com a gente?</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <a
                            href="mailto:contato@interlagosconectado.com.br"
                            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl backdrop-blur-sm transition-all w-full md:w-auto justify-center"
                        >
                            <Mail size={20} />
                            <span>contato@interlagos.com</span>
                        </a>
                        <a
                            href="https://wa.me/5511999999999"
                            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all w-full md:w-auto justify-center font-bold"
                        >
                            <Phone size={20} />
                            <span>WhatsApp da Gestão</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
