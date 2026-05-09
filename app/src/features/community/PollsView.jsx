import { useState, useEffect } from 'react';
import { BarChart2, Clock, CheckCircle2 } from 'lucide-react';
import { fetchPolls, fetchUserVotesForPolls, checkUserVoted, submitVote } from '../../services/pollsService';
import { useAuth } from '../auth/AuthContext';
import { PageHero, MobileCard, SectionHeader } from '../../components/mobile';

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
      // Voto já computado ou erro silencioso.
    } finally {
      setVoting(null);
    }
  }

  const renderSkeleton = () => (
    <div className="space-y-3 px-3 pt-4">
      {[1, 2, 3].map(i => (
        <MobileCard key={i} bodyClassName="space-y-3 p-4 animate-pulse">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
          <div className="space-y-2">
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </MobileCard>
      ))}
    </div>
  );

  return (
    <div className="mobile-page bg-gray-50 pb-24 animate-in fade-in duration-300">
      <div className="sticky top-14 z-20 mobile-sticky-panel pb-2 shadow-sm">
        <PageHero
          section="news"
          title="Enquetes do Bairro"
          subtitle="Vote e veja a opinião da comunidade"
          icon={BarChart2}
          compact
        />
      </div>

      {loading ? renderSkeleton() : error ? (
        <div className="flex min-h-[50vh] items-center justify-center p-4">
          <p className="text-center text-sm text-red-500">{error}</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-4 text-center">
          <BarChart2 className="h-10 w-10 text-gray-300" aria-hidden="true" />
          <p className="text-sm text-gray-400">Nenhuma enquete disponível no momento.</p>
        </div>
      ) : (
        <>
          <SectionHeader
            title="Enquetes abertas"
            subtitle={`${polls.length} enquete${polls.length !== 1 ? 's' : ''}`}
          />

          <div className="space-y-3 px-3">
            {polls.map((poll) => {
              const counts = voteCounts[poll.id] || {};
              const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
              const isClosed = poll.status === 'closed';
              const hasVoted = !!userVotes[poll.id];
              const isVoting = voting === poll.id;
              const showResults = isClosed || hasVoted;
              const options = [...(poll.poll_options || [])].sort((a, b) => a.display_order - b.display_order);

              return (
                <MobileCard key={poll.id} bodyClassName="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="pr-2 text-sm font-bold leading-relaxed text-gray-900">{poll.question}</h2>
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${isClosed ? 'bg-gray-100 text-gray-400' : 'bg-brand-50 text-brand-600'}`}>
                      {isClosed ? <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> : <Clock className="h-3 w-3" aria-hidden="true" />}
                      {isClosed ? 'Encerrada' : 'Aberta'}
                    </span>
                  </div>

                  <div className="mb-4 space-y-3">
                    {options.map((option) => {
                      const count = counts[option.id] || 0;
                      const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={`w-full rounded-xl border p-3 text-left transition-all ${!showResults && !isClosed ? 'border-gray-100 bg-gray-50 active:scale-[0.99]' : 'border-transparent bg-transparent'}`}
                          onClick={() => !showResults && handleVote(poll, option.id)}
                          disabled={showResults || isClosed || isVoting}
                        >
                          <div className="mb-2 flex justify-between gap-3 text-xs">
                            <span className="font-medium text-gray-700">{option.text}</span>
                            {showResults && <span className="font-bold text-gray-500">{percentage}%</span>}
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            {showResults && (
                              <div
                                className="h-full rounded-full bg-brand-600 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="min-h-[24px]">
                    {showResults && (
                      <p className="text-right text-[11px] text-gray-400">
                        {totalVotes} voto{totalVotes !== 1 ? 's' : ''}
                      </p>
                    )}

                    {isVoting && (
                      <p className="text-center text-[11px] font-bold text-brand-600">Registrando voto...</p>
                    )}

                    {hasVoted && !isClosed && (
                      <p className="flex items-center justify-center gap-1 text-center text-[11px] text-brand-600">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Voto registrado
                      </p>
                    )}
                  </div>
                </MobileCard>
              );
            })}
          </div>

          <p className="mt-8 px-6 text-center text-xs text-gray-400">
            Somente usuários registrados podem votar para garantir a transparência.
          </p>
        </>
      )}
    </div>
  );
};

export default PollsView;
