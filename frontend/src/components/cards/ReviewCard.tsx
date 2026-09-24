import React from 'react';
import { Link } from 'react-router-dom';
import { Review } from '../../types';
import { Avatar } from '../common/Avatar';
import { StarRating } from '../common/StarRating';
import { Quote } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={review.reviewer.avatar} name={review.reviewer.name} size="sm" />
          <div>
            <Link to={`/users/${review.reviewer._id}`}>
              <h5 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition">
                {review.reviewer.name}
              </h5>
            </Link>
            <p className="text-xs text-slate-400">{review.reviewer.college}</p>
          </div>
        </div>

        <StarRating rating={review.rating} size="sm" />
      </div>

      <div className="relative pl-6 text-xs text-slate-600 leading-relaxed italic">
        <Quote className="w-4 h-4 text-indigo-300 absolute left-0 top-0" />
        "{review.comment}"
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-right">
        {new Date(review.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
