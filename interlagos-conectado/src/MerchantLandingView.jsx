import React from 'react';
import { TrendingUp, Users, Ticket, BarChart3, ShieldCheck, ArrowRight, Store } from 'lucide-react';

export default function MerchantLandingView({ onRegisterClick }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-indigo-900 text-white mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/90 to-transparent" />

                <div className="relative z-10 p-8 md:p-12 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/30 border border-indigo-400/30 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-200 mb-6">
                        <Store size={16} />
                        <span>Área do Comerciante</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Transforme seu negócio em uma <span className="text-indigo-400">referência local</span>
                    </h2>
                    <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                        Junte-se a centenas de comércios de Interlagos que já estão crescendo com nossa plataforma.
                        Gestão, visibilidade e fidelização em um só lugar.
                    </p>
                    <button
                        onClick={onRegisterClick}
                        className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold py-4 px-8 rounded-xl shadow-lg shadow-white/10 transition-all active:scale-95 flex items-center gap-2"
                    >
                        Cadastrar meu Negócio
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-colors group">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                        <TrendingUp size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Gestão de Negócio</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Controle total sobre como sua marca aparece. Atualize horários, fotos, contatos e cardápio em tempo real.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-colors group">
                    <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                        <Ticket size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Cupons de Desconto</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Crie campanhas promocionais e gere cupons digitais para atrair novos clientes e fidelizar os antigos.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-colors group">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                        <BarChart3 size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Relatórios de Visitas</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Saiba quantas pessoas visualizaram seu perfil, clicaram no seu telefone ou traçaram rota até você.
                    </p>
                </div>
            </div>

            {/* Social Proof / Stats */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 text-center">
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">+5.000</div>
                        <div className="text-indigo-400 font-medium">Usuários Ativos</div>
                    </div>
                    <div className="md:border-x border-white/10">
                        <div className="text-4xl font-bold text-white mb-2">+200</div>
                        <div className="text-indigo-400 font-medium">Comércios Parceiros</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">98%</div>
                        <div className="text-indigo-400 font-medium">Satisfação</div>
                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <div className="mt-16 text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Pronto para alavancar suas vendas?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                    Não perca mais tempo. A digitalização do seu negócio em Interlagos começa aqui.
                </p>
                <button
                    onClick={onRegisterClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-xl shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1"
                >
                    Quero ser Parceiro
                </button>
            </div>
        </div>
    );
}
