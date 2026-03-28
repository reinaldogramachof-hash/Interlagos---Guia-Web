import React from 'react';
import { History, MapPin, Trees, Waves, Leaf } from 'lucide-react';

export default function HistoryView() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-20 px-3 pt-3">

            {/* Hero Section */}
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group">
                <div className="absolute inset-0 bg-indigo-900/40 z-10" />
                <img
                    src="/herosjc.png"
                    alt="São José dos Campos — Parque Interlagos"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-20 flex flex-col justify-end p-8">
                    <div className="flex items-center gap-3 mb-2 text-indigo-400">
                        <History size={24} />
                        <span className="text-sm font-bold uppercase tracking-wider">Nossa História</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">Parque Interlagos</h2>
                    <p className="text-slate-300 max-w-2xl">
                        Tradição e transformação na Zona Sul de São José dos Campos.
                    </p>
                </div>
            </div>

            {/* 4 Seções de conteúdo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Origem */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <MapPin size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Origem e Desenvolvimento Urbano</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        A história do bairro remete à segunda metade do século XX, período em que São José dos Campos se
                        consolidava como polo tecnológico e industrial. O crescimento acelerado gerou demanda por habitação
                        para a classe trabalhadora, transformando latifúndios e áreas de transição ambiental em um próspero
                        centro residencial e comercial.
                    </p>
                </div>

                {/* Identidade */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                            <Trees size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Identidade e Dinâmicas Sociais</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        O Interlagos consolidou-se como um espaço de luta e conquista. O bairro acolheu famílias que buscavam
                        qualidade de vida próxima aos centros industriais e desenvolveu uma identidade própria, marcada por
                        vida comunitária pulsante. Deixou de ser apenas área periférica para se tornar um centro regional
                        autossuficiente, com comércio diversificado e infraestrutura sólida.
                    </p>
                </div>

                {/* O Lago */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                            <Waves size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">O Lago: O Coração do Bairro</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        Um dos marcos geográficos e sociais mais importantes do Parque Interlagos é o seu lago. Historicamente
                        utilizado para lazer, ele passou por importantes processos de requalificação. As obras de revitalização
                        e sustentabilidade realizadas pela prefeitura devolveram ao bairro um espaço público moderno, com
                        iluminação, áreas de convivência e pistas de caminhada.
                    </p>
                </div>

                {/* Sustentabilidade */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <Leaf size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sustentabilidade e Futuro</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        Hoje, o Parque Interlagos enfrenta os desafios da urbanização moderna com um olhar atento à
                        sustentabilidade. O equilíbrio entre desenvolvimento habitacional e preservação do espaço público
                        é a chave para seu crescimento contínuo — rumo a um futuro mais verde, conectado e próspero
                        para todos os seus habitantes.
                    </p>
                </div>
            </div>

            {/* Citação de encerramento */}
            <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <History size={32} className="mb-4 opacity-80" />
                    <blockquote className="text-xl font-semibold leading-relaxed mb-4">
                        "Mais do que um conjunto de ruas e quadras, somos uma comunidade que valoriza
                        seu passado para construir um futuro mais verde, conectado e próspero."
                    </blockquote>
                    <p className="text-indigo-200 text-sm font-medium">
                        — História do Parque Interlagos · São José dos Campos, SP
                    </p>
                </div>
            </div>
        </div>
    );
}
