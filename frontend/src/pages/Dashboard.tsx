import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { matchService } from '../services/matchService';
import { DashboardStats, ExchangeRequest, Skill, Item, MatchResult } from '../types';
import { SkillCard } from '../components/cards/SkillCard';
import { ItemCard } from '../components/cards/ItemCard';
import { MatchCard } from '../components/cards/MatchCard';
import { ExchangeModal } from '../components/common/ExchangeModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import {
  Sparkles,
  BookOpen,
  Package,
  Repeat,
  Clock,
  CheckCircle2,
  Star,
  Plus,
  ArrowRight,
  Flame,
  MessageSquare,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentExchanges, setRecentExchanges] = useState<ExchangeRequest[]>([]);
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Proposal modal
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, matchRes] = await Promise.all([
        userService.getDashboardStats(),
        matchService.getSmartMatches(),
      ]);

      if (dashRes.success) {
        setStats(dashRes.stats);
        setRecentExchanges(dashRes.recentActiveExchanges);
        setMySkills(dashRes.mySkills);
        setMyItems(dashRes.myItems);
      }

      if (matchRes.success) {
        setMatches(matchRes.allMatches.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateSwap = (targetUser: any) => {
    setSelectedTargetUser(targetUser);
    setExchangeModalOpen(true);
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading your dashboard..." />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Active Student Profile
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {user?.college} • {user?.location} • Ready to trade skills and campus essentials.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/create-skill"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-sm transition"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            + Offer Skill
          </Link>
          <Link
            to="/create-item"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
          >
            <Package className="w-4 h-4" />
            + List Item
          </Link>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Listings
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalListings || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats?.totalSkills || 0} Skills • {stats?.totalItems || 0} Items
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Swaps
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats?.activeSwaps || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">In progress & coordinating</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{stats?.pendingRequests || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats?.pendingReceived || 0} received • {stats?.pendingSent || 0} sent
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Swap Rating
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.avgRating ? `${stats.avgRating.toFixed(1)} / 5` : 'New'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats?.completedSwaps || 0} completed exchanges
          </p>
        </div>
      </div>

      {/* Recommended Smart Matches Section */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Recommended Smart Matches</h2>
            </div>
            <Link
              to="/matches"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All Matches
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.map((m, idx) => (
              <MatchCard key={idx} match={m} onInitiateSwap={handleInitiateSwap} />
            ))}
          </div>
        </div>
      )}

      {/* Active Exchanges & Requests Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <Repeat className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Active Exchanges & Inbound Requests</h2>
          </div>
          <Link
            to="/exchanges"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Manage All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentExchanges.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {recentExchanges.map(ex => {
              const isSender = ex.sender._id === user?._id || ex.sender._id === user?.id;
              const other = isSender ? ex.receiver : ex.sender;

              return (
                <div key={ex._id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-3">
                    <Avatar src={other.avatar} name={other.name} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{other.name}</h4>
                        <Badge
                          variant={
                            ex.status === 'Accepted'
                              ? 'accepted'
                              : ex.status === 'Pending'
                              ? 'pending'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {ex.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        Offer: {ex.offeredSkill?.name || ex.offeredItem?.name || ex.customOfferText} ↔ Request: {ex.requestedSkill?.name || ex.requestedItem?.name || ex.customRequestText}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {ex.status === 'Accepted' && (
                      <Link
                        to={`/messages?exchange=${ex._id}`}
                        className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat
                      </Link>
                    )}
                    <Link
                      to={`/exchanges/${ex._id}`}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No active exchanges right now. Browse Discover or explore Smart Matches to start trading!
          </div>
        )}
      </div>

      {/* My Listings Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Active Listings</h2>
          <div className="flex items-center gap-2 text-xs">
            <Link to="/create-skill" className="font-bold text-indigo-600 hover:underline">
              + New Skill
            </Link>
            <span>•</span>
            <Link to="/create-item" className="font-bold text-emerald-600 hover:underline">
              + New Item
            </Link>
          </div>
        </div>

        {mySkills.length === 0 && myItems.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-500">You haven't published any skills or items yet.</p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/create-skill"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl"
              >
                + Offer a Skill
              </Link>
              <Link
                to="/create-item"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl"
              >
                + List an Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mySkills.map(skill => (
              <SkillCard key={skill._id} skill={skill} isOwner={true} />
            ))}
            {myItems.map(item => (
              <ItemCard key={item._id} item={item} isOwner={true} />
            ))}
          </div>
        )}
      </div>

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
