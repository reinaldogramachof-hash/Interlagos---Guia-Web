import { useState, useEffect } from 'react';
import { BarChart2, Clock, CheckCircle2 } from 'lucide-react';
import { fetchPolls, fetchUserVotesForPolls, checkUserVoted, submitVote } from '../../services/pollsService';
import { useAuth } from '../auth/AuthContext';

const PollsView = ({ onRequireAuth }) => {
  const { currentUser } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteCounts, setVoteCounts] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [voting, setVoting] = useState(null);

  useEffect(() => {
    loadPolls();
  }, []);

  useEffect(() => {
    if (currentUser && polls.length > 0) {
      const pollIds = polls.map(p => p.id);
      fetchUserVotesForPolls(currentUser.id, pollIds).then(votes => {
        const map = {};
        votes.forEach(v => { map[v.poll_id] = true; });
        setUserVotes(map);
      }).catch(() => {});
    }
  }, [currentUser, polls]);

  async function loadPolls() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPolls();
      setPolls(data);
      // Derive voteCounts from join — zero extra requests
      const counts = {};
      data.forEach(poll => {
        counts[poll.id] = {};
        poll.poll_options?.forEach(opt => {
          counts[poll.id][opt.id] = opt.poll_votes?.length ?? 0;
        });
      });
      setVoteCounts(counts);
    } catch {
      setError('Não foi possível carregar as enquetes.');
    } finally {
      setLoading(false);
    }
  }

  async function loadUserVoteStatus(pollId) {
    if (!currentUser) return;
    const voted = await checkUserVoted(pollId, currentUser.id);
    setUserVotes(prev => ({ ...prev, [pollId]: voted }));
  }

  async function handleVote(poll, optionId) {
    if (!currentUser) {
      onRequireAuth?.(() => {});
      return;
    }
    if (poll.status === 'closed' || userVotes[poll.id] || voting === poll.id) return;
    setVoting(poll.id);
    try {
      const result = await submitVote(poll.id, optionId, currentUser.id);
      if (result?.success) {
        setUserVotes(prev => ({ ...prev, [poll.id]: true }));
        await loadUserVoteStatus(poll.id);
      }
    } catch {
      // voto já computado ou erro silencioso
    } finally {
      setVoting(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
              <div className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 min-h-[50vh] bg-white flex items-center justify-center">
        <p className="text-sm text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="p-4 min-h-[50vh] bg-white flex flex-col items-center justify-center gap-2">
        <BarChart2 className="w-10 h-10 text-gray-300" />
        <p className="text-sm text-gray-400 text-center">Nenhuma enquete disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen pb-24">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <BarChart2 className="w-6 h-6 text-brand-600" />
          <h1 className="text-xl font-bold text-gray-900">Enquetes do Bairro</h1>
        </div>
        <p className="text-gray-500 text-sm">Vote e veja a opinião da comunidade</p>
      </div>

      <div className="space-y-4">
        {polls.map((poll) => {
          const counts = voteCounts[poll.id] || {};
          const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
          const isClosed = poll.status === 'closed';
          const hasVoted = !!userVotes[poll.id];
          const isVoting = voting === poll.id;
          const showResults = isClosed || hasVoted;
          const options = [...(poll.poll_options || [])].sort((a, b) => a.display_order - b.display_order);

          return (
            <div key={poll.id} className="bg-white rounded-card shadow-card border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-gray-900 font-medium text-sm leading-relaxed pr-8">{poll.question}</h2>
                <span className={`text-[10px] px-2 py-1 rounded-pill flex items-center gap-1 shrink-0 ${isClosed ? 'bg-gray-100 text-gray-400' : 'bg-brand-50 text-brand-600'}`}>
                  {isClosed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {isClosed ? 'Encerrada' : 'Aberta'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {options.map((option) => {
                  const count = counts[option.id] || 0;
                  const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  return (
                    <div
                      key={option.id}
                      className={`relative ${!showResults && !isClosed ? 'cursor-pointer group' : ''}`}
                      onClick={() => !showResults && handleVote(poll, option.id)}
                    >
                      <div className="flex justify-between text-[11px] mb-1 px-1">
                        <span className="text-gray-700">{option.text}</span>
                        {showResults && <span className="text-gray-400">{percentage}%</span>}
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        {showResults && (
                          <div
                            className="h-full bg-brand-600 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showResults && (
                <p className="text-[11px] text-gray-400 text-right mb-2">
                  {totalVotes} voto{totalVotes !== 1 ? 's' : ''}
                </p>
              )}

              {!showResults && (
                <button
                  disabled={isClosed || isVoting}
                  className="w-full py-2.5 rounded-pill text-sm font-medium transition-all bg-brand-600 hover:bg-brand-700 text-white active:scale-95 min-h-[44px]"
                >
                  {isVoting ? 'Registrando...' : 'Selecione uma opção acima para votar'}
                </button>
              )}

              {hasVoted && !isClosed && (
                <p className="text-center text-[11px] text-brand-600 mt-2 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Voto registrado
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        Somente usuários registrados podem votar para garantir a transparência.
      </p>
    </div>
  );
};

export default PollsView;