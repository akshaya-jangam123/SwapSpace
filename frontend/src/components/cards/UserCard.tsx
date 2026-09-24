import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { Avatar } from '../common/Avatar';
import { StarRating } from '../common/StarRating';
import { MapPin, ArrowRightLeft, BookOpen, Package, UserCheck } from 'lucide-react';

interface UserCardProps {
  user: User;
  onInitiateSwap?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onInitiateSwap }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition flex flex-col justify-between">
      <div>
        {/* User Info Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div className="flex-1 min-w-0">
            <Link to={`/users/${user._id || user.id}`}>
              <h4 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition truncate">
                {user.name}
              </h4>
            </Link>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{user.college || user.location}</span>
            </div>
            <div className="mt-1.5">
              <StarRating rating={user.avgRating || 0} totalReviews={user.totalReviews} size="sm" />
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed italic">
            "{user.bio}"
          </p>
        )}

        {/* Skills/Items Offered */}
        <div className="space-y-2 mb-4">
          {user.skillsOffered && user.skillsOffered.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-indigo-500" /> Offers Skills:
              </span>
              <div className="flex flex-wrap gap-1">
                {user.skillsOffered.slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-medium bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100"
                  >
                    {s}
                  </span>
                ))}
                {user.skillsOffered.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[11px] text-slate-400 font-medium">
                    +{user.skillsOffered.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {user.skillsWanted && user.skillsWanted.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3 text-emerald-500" /> Wants Skills:
              </span>
              <div className="flex flex-wrap gap-1">
                {user.skillsWanted.slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/users/${user._id || user.id}`}
          className="text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
        >
          View Full Profile
        </Link>

        {onInitiateSwap && (
          <button
            type="button"
            onClick={() => onInitiateSwap(user)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
          >
            <ArrowRightLeft className="w-3 h-3" />
            Swap
          </button>
        )}
      </div>
    </div>
  );
};
