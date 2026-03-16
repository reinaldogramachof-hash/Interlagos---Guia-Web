import React from 'react';
import { History, MapPin, Calendar } from 'lucide-react';

export default function HistoryView() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-20">
            {/* Hero Section */}
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group">
                <div className="absolute inset-0 bg-indigo-900/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1000"
                    alt="Interlagos Antigo"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-20 flex flex-col justify-end p-8">
                    <div className="flex items-center gap-3 mb-2 text-indigo-400">
                        <History size={24} />
                        <span className="text-sm font-bold uppercase tracking-wider">Nossa História</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">Interlagos</h2>
                    <p className="text-slate-200 max-w-2xl">
                        De um projeto de cidade satélite ao templo do automobilismo brasileiro.
                        Conheça a trajetória do nosso bairro.
                    </p>
                </div>
            </div>

            {/* Timeline / Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">O Início (1920)</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        A região, originalmente conhecida pelas suas represas, foi idealizada pelo engenheiro britânico Louis Romero Sanson.
                        Seu plano era criar um bairro balneário de luxo e um autódromo, aproveitando a topografia única entre as represas Billings e Guarapiranga.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <MapPin size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">O Autódromo (1940)</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Inaugurado em 12 de maio de 1940, o Autódromo de Interlagos colocou o bairro no mapa mundial.
                        Seu traçado desafiador, inspirado nas pistas da Europa e EUA, tornou-se palco de momentos históricos da Fórmula 1 e do automobilismo nacional.
                    </p>
                </div>
            </div>

            {/* Curiosities */}
            <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <h3 className="text-2xl font-bold mb-6 relative z-10">Você Sabia?</h3>
                <ul className="space-y-4 relative z-10">
                    <li className="flex items-start gap-3">
                        <span className="bg-white/20 p-1 rounded-full mt-1">✓</span>
                        <p>O nome "Interlagos" significa literalmente "entre lagos", referindo-se à sua posição entre as represas.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="bg-white/20 p-1 rounded-full mt-1">✓</span>
                        <p>O bairro foi planejado para ser uma "Cidade Satélite" de São Paulo, com zonas residenciais, comerciais e de lazer bem definidas.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="bg-white/20 p-1 rounded-full mt-1">✓</span>
                        <p>A Ayrton Senna, ídolo nacional, cresceu correndo no kartódromo que hoje leva seu nome, anexo ao circuito principal.</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
