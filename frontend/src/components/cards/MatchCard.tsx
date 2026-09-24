import React from 'react';
import { Link } from 'react-router-dom';
import { MatchResult } from '../../types';
import { Avatar } from '../common/Avatar';
import { StarRating } from '../common/StarRating';
import { Flame, Sparkles, ArrowRightLeft, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface MatchCardProps {
  match: MatchResult;
  onInitiateSwap?: (user: any) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onInitiateSwap }) => {
  const isPerfect = match.matchType === 'perfect';

  return (
    <div
      className={`relative bg-white rounded-2xl border ${
        isPerfect
          ? 'border-amber-300 shadow-md ring-1 ring-amber-400/20'
          : 'border-slate-200/80 shadow-sm'
      } p-6 flex flex-col justify-between transition hover:shadow-lg`}
    >
      {/* Top Banner for Perfect Match */}
      {isPerfect && (
        <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 fill-white" />
          🔥 Perfect Swap Match
        </div>
      )}

      <div>
        {/* Header: User Profile Summary + Match Percentage */}
        <div className="flex items-start justify-between gap-4 mb-5 pt-1">
          <div className="flex items-center gap-3">
            <Avatar src={match.user.avatar} name={match.user.name} size="lg" />
            <div>
              <Link to={`/users/${match.user._id || match.user.id}`}>
                <h4 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition">
                  {match.user.name}
                </h4>
              </Link>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[150px]">{match.user.college || match.user.location}</span>
              </div>
              <div className="mt-1">
                <StarRating rating={match.user.avgRating || 0} totalReviews={match.user.totalReviews} size="sm" />
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="text-right">
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl font-extrabold text-sm ${
                match.score >= 85
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : match.score >= 60
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {match.score}% Match
            </div>
          </div>
        </div>

        {/* Breakdown of what each wants & offers */}
        <div className="space-y-2.5 mb-5 text-xs">
          {/* What they offer that you want */}
          {match.userAWantsUserBOffers && match.userAWantsUserBOffers.length > 0 && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <div className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                They offer what you want:
              </div>
              <ul className="list-disc list-inside text-emerald-800 space-y-0.5 ml-1">
                {match.userAWantsUserBOffers.map((item, idx) => (
                  <li key={idx} className="truncate">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What you offer that they want */}
          {match.userBWantsUserAOffers && match.userBWantsUserAOffers.length > 0 && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <div className="font-semibold text-indigo-900 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                You offer what they want:
              </div>
              <ul className="list-disc list-inside text-indigo-800 space-y-0.5 ml-1">
                {match.userBWantsUserAOffers.map((item, idx) => (
                  <li key={idx} className="truncate">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link
          to={`/users/${match.user._id || match.user.id}`}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition flex items-center gap-1"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {onInitiateSwap && (
          <button
            type="button"
            onClick={() => onInitiateSwap(match.user)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Send Proposal
          </button>
        )}
      </div>
    </div>
  );
};
