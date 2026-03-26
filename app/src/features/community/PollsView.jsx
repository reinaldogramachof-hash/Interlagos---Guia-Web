import React from 'react';
import { BarChart2, Clock, CheckCircle2 } from 'lucide-react';

const PollsView = ({ onRequireAuth }) => {
    const polls = [
        {
            id: 1,
            question: "Qual deve ser a prioridade de melhoria para a Praça do Bairro este mês?",
            deadline: "Faltam 3 dias",
            options: [
                { text: "Iluminação LED", votes: 45 },
                { text: "Novos Bancos", votes: 20 },
                { text: "Academia ao Ar Livre", votes: 35 }
            ],
            totalVotes: 100
        },
        {
            id: 2,
            question: "Como você avalia a segurança no bairro recentemente?",
            deadline: "Encerrada",
            options: [
                { text: "Boa", votes: 25 },
                { text: "Regular", votes: 50 },
                { text: "Preocupante", votes: 25 }
            ],
            totalVotes: 200,
            closed: true
        }
    ];

    const handleVote = () => {
        if (onRequireAuth) {
            onRequireAuth(() => {
                console.log("Votando...");
            });
        }
    };

    return (
        <div className="p-4 bg-zinc-950 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <BarChart2 className="w-6 h-6 text-purple-500" />
                    <h1 className="text-xl font-bold text-white">Enquetes do Bairro</h1>
                </div>
                <p className="text-zinc-400 text-sm">Vote e veja a opinião da comunidade</p>
            </div>

            {/* Content List */}
            <div className="space-y-4">
                {polls.map((poll) => (
                    <div key={poll.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-hidden shadow-lg">
                        <div className="flex justify-between items-start mb-3">
                            <h2 className="text-white font-medium text-sm leading-relaxed pr-8">{poll.question}</h2>
                            <span className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${poll.closed ? 'bg-zinc-800 text-zinc-500' : 'bg-purple-900/30 text-purple-400'}`}>
                                <Clock className="w-3 h-3" />
                                {poll.deadline}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            {poll.options.map((option, idx) => {
                                const percentage = Math.round((option.votes / poll.totalVotes) * 100);
                                return (
                                    <div key={idx} className="relative group">
                                        <div className="flex justify-between text-[11px] mb-1 px-1">
                                            <span className="text-zinc-300">{option.text}</span>
                                            <span className="text-zinc-500">{percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-purple-500/50 rounded-full transition-all duration-500" 
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button 
                            onClick={handleVote}
                            disabled={poll.closed}
                            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                                poll.closed 
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                : 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'
                            }`}
                        >
                            {poll.closed ? 'Enquete Encerrada' : 'Votar'}
                        </button>
                    </div>
                ))}
            </div>

            <p className="mt-8 text-center text-xs text-zinc-600">
                Somente usuários registrados podem votar para garantir a transparência da comunidade.
            </p>
        </div>
    );
};

export default PollsView;
