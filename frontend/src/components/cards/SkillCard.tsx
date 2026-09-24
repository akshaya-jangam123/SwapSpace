import React from 'react';
import { Link } from 'react-router-dom';
import { Skill } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { StarRating } from '../common/StarRating';
import { BookOpen, MapPin, ArrowRightLeft, Clock, Eye } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  onSendRequest?: (skill: Skill) => void;
  isOwner?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onSendRequest, isOwner = false }) => {
  const levelVariant = {
    Beginner: 'info',
    Intermediate: 'primary',
    Advanced: 'secondary',
  }[skill.level] as any;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-5">
        {/* Top bar: Category + Level badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            {skill.category}
          </span>
          <Badge variant={levelVariant} size="sm">
            {skill.level}
          </Badge>
        </div>

        {/* Skill Title */}
        <Link to={`/skills/${skill._id}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 mb-2">
            {skill.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {skill.description}
        </p>

        {/* What I want in exchange box */}
        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 mb-1">
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
            Wants in exchange:
          </div>
          <p className="text-xs text-indigo-700 font-medium line-clamp-1">
            {skill.wantInExchange}
          </p>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{skill.availability}</span>
        </div>

        {/* Owner Info */}
        {skill.owner && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to={`/users/${skill.owner._id || skill.owner.id}`}
              className="flex items-center gap-2 group/user"
            >
              <Avatar src={skill.owner.avatar} name={skill.owner.name} size="sm" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 group-hover/user:text-indigo-600 transition truncate max-w-[130px]">
                  {skill.owner.name}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{skill.owner.college || skill.owner.location}</span>
                </div>
              </div>
            </Link>

            <StarRating
              rating={skill.owner.avgRating || 0}
              totalReviews={skill.owner.totalReviews}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/skills/${skill._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </Link>

        {!isOwner && onSendRequest && (
          <button
            type="button"
            onClick={() => onSendRequest(skill)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Send Request
          </button>
        )}
      </div>
    </div>
  );
};
