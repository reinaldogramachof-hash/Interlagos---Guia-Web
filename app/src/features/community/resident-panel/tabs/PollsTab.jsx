import React, { useState, useEffect } from 'react';
import { BarChart2, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchPolls, fetchPollVoteCounts, checkUserVoted, submitVote } from '../../../../services/pollsService';

export default function PollsTab({ currentUser }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteCounts, setVoteCounts] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [voting, setVoting] = useState(null);

  useEffect(() => { loadPolls(); }, []);
  useEffect(() => {
    if (currentUser && polls.length > 0) {
      polls.forEach(poll => loadUserVoteStatus(poll.id));
    }
  }, [currentUser, polls]);

  async function loadPolls() {
    setLoading(true);
    try {
      const data = await fetchPolls();
      setPolls(data);
      data.forEach(poll => loadVoteCounts(poll.id));
    } finally { setLoading(false); }
  }

  async function loadVoteCounts(pollId) {
    const votes = await fetchPollVoteCounts(pollId);
    const counts = {};
    votes.forEach(v => { counts[v.option_id] = (counts[v.option_id] || 0) + 1; });
    setVoteCounts(prev => ({ ...prev, [pollId]: counts }));
  }

  async function loadUserVoteStatus(pollId) {
    if (!currentUser) return;
    const voted = await checkUserVoted(pollId, currentUser.id || currentUser.uid);
    setUserVotes(prev => ({ ...prev, [pollId]: voted }));
  }

  async function handleVote(poll, optionId) {
    if (poll.status === 'closed' || userVotes[poll.id] || voting === poll.id) return;
    setVoting(poll.id);
    try {
      const result = await submitVote(poll.id, optionId, currentUser.id || currentUser.uid);
      if (result?.success) {
        setUserVotes(prev => ({ ...prev, [poll.id]: true }));
        await loadVoteCounts(poll.id);
      }
    } finally { setVoting(null); }
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-600" size={28} /></div>;
  if (polls.length === 0) return (
    <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
      <p className="text-slate-500">Nenhuma enquete disponível no momento.</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Enquetes do Bairro</h1>
        </div>
        <p className="text-gray-500 text-sm">Vote e veja a opinião da comunidade</p>
      </div>

      <div className="space-y-4">
        {polls.map((poll) => {
          const counts = voteCounts[poll.id] || {};
          const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
          
          // Lógica de expiração no client para feedback imediato
          const now = new Date();
          const isExpired = poll.expires_at && new Date(poll.expires_at) < now;
          const isClosed = poll.status === 'closed' || isExpired;
          
          const hasVoted = !!userVotes[poll.id];
          const isVoting = voting === poll.id;
          const showResults = isClosed || hasVoted;
          const options = [...(poll.poll_options || [])].sort((a, b) => a.display_order - b.display_order);

          return (
            <div key={poll.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h2 className="text-gray-900 dark:text-white font-bold text-sm leading-relaxed pr-2 break-words">{poll.question}</h2>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold ${isClosed ? 'bg-slate-100 dark:bg-slate-700 text-slate-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                    {isClosed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {isClosed ? 'Encerrada' : 'Aberta'}
                  </span>
                  {!isClosed && poll.expires_at && (
                    <span className="text-[9px] text-amber-600 font-medium whitespace-nowrap">
                      Expira em {new Date(poll.expires_at).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {options.map((option) => {
                  const count = counts[option.id] || 0;
                  const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  return (
                    <div key={option.id} className={`relative group ${!showResults && !isClosed ? 'cursor-pointer' : ''}`} onClick={() => !showResults && handleVote(poll, option.id)}>
                      <div className="flex justify-between text-[11px] mb-1 px-1">
                        <span className={`font-medium transition-colors ${!showResults && !isClosed ? 'group-hover:text-emerald-600 text-slate-700 dark:text-slate-300' : 'text-slate-500'}`}>{option.text}</span>
                        {showResults && <span className="text-slate-400 font-bold">{percentage}%</span>}
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        {showResults && (
                          <div className="h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showResults && <p className="text-[11px] text-slate-400 text-right mb-2 font-medium">{totalVotes} voto{totalVotes !== 1 ? 's' : ''} total</p>}

              {!showResults && (
                <button disabled={isClosed || isVoting} className="w-full py-2.5 rounded-xl text-xs font-bold transition-all bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/10 min-h-[44px]">
                  {isVoting ? <div className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={14} /> Registrando...</div> : (
                    <>
                      <span className="hidden sm:inline">Selecione uma opção acima para votar</span>
                      <span className="sm:hidden">Selecione uma opção</span>
                    </>
                  )}
                </button>
              )}

              {hasVoted && !isClosed && (
                <p className="text-center text-[11px] text-emerald-600 mt-2 font-bold flex items-center justify-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 className="w-3 h-3" /> Voto registrado com sucesso
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
