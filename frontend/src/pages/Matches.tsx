import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { matchService } from '../services/matchService';
import { MatchResult, User } from '../types';
import { MatchCard } from '../components/cards/MatchCard';
import { ExchangeModal } from '../components/common/ExchangeModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Sparkles, Flame, ArrowRightLeft, HelpCircle } from 'lucide-react';

export const Matches: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [perfectMatches, setPerfectMatches] = useState<MatchResult[]>([]);
  const [oneWayMatches, setOneWayMatches] = useState<MatchResult[]>([]);
  const [filter, setFilter] = useState<'all' | 'perfect' | 'oneway'>('all');
  const [loading, setLoading] = useState(true);

  // Proposal modal
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState<User | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await matchService.getSmartMatches();
      if (res.success) {
        setMatches(res.allMatches);
        setPerfectMatches(res.perfectMatches);
        setOneWayMatches(res.oneWayMatches);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateSwap = (targetUser: User) => {
    setSelectedTargetUser(targetUser);
    setExchangeModalOpen(true);
  };

  const displayedMatches =
    filter === 'perfect' ? perfectMatches : filter === 'oneway' ? oneWayMatches : matches;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-rose-500/10 rounded-3xl p-6 sm:p-10 border border-amber-200/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            AI Smart Matching Engine
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Peer Swap Matches
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Our algorithm matches your listed <strong className="text-slate-800">skills wanted</strong> against what your peers offer, and highlights mutual perfect trades.
          </p>
        </div>

        {/* Algorithm Summary Box */}
        <div className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2 max-w-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> How Match Score Works:
          </div>
          <div className="text-slate-600 space-y-1 text-[11px]">
            <p>🔥 <strong className="text-emerald-700">85%–98% Match:</strong> Mutual 2-way swap</p>
            <p>⚡ <strong className="text-indigo-700">50%–75% Match:</strong> Direct 1-way match</p>
            <p>🏫 <strong className="text-slate-700">35% Match:</strong> Same campus peer</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            filter === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Opportunities ({matches.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('perfect')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            filter === 'perfect'
              ? 'bg-white text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          🔥 Perfect Matches ({perfectMatches.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('oneway')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            filter === 'oneway'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          One-Way Offers ({oneWayMatches.length})
        </button>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <LoadingSpinner message="Calculating peer compatibility scores..." />
      ) : (
        <div>
          {displayedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMatches.map((m, idx) => (
                <MatchCard key={idx} match={m} onInitiateSwap={handleInitiateSwap} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Sparkles className="w-8 h-8 text-amber-500" />}
              title="No Matches Found"
              description="Add more skills wanted or items wanted in your profile settings so our algorithm can discover compatible peers for you!"
              actionText="Update Profile Preferences"
              onAction={() => window.location.assign('/profile/edit')}
            />
          )}
        </div>
      )}

      {/* Exchange Proposal Modal */}
      {selectedTargetUser && (
        <ExchangeModal
          isOpen={exchangeModalOpen}
          onClose={() => setExchangeModalOpen(false)}
          targetUser={selectedTargetUser}
        />
      )}
    </div>
  );
};
