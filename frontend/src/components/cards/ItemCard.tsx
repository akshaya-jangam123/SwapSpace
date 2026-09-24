import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { StarRating } from '../common/StarRating';
import { MapPin, ArrowRightLeft, Package, Eye, Tag } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onSendRequest?: (item: Item) => void;
  isOwner?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSendRequest, isOwner = false }) => {
  const conditionVariant = {
    New: 'success',
    'Like New': 'primary',
    Good: 'secondary',
    Used: 'warning',
  }[item.condition] as any;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Item Image */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Package className="w-12 h-12" />
          </div>
        )}

        {/* Condition Badge on top of image */}
        <div className="absolute top-3 right-3">
          <Badge variant={conditionVariant} size="sm">
            {item.condition}
          </Badge>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900/70 backdrop-blur-sm text-white rounded-lg">
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link to={`/items/${item._id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 mb-2">
              {item.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* What I want in exchange box */}
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/80 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 mb-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
              Wants in exchange:
            </div>
            <p className="text-xs text-emerald-700 font-medium line-clamp-1">
              {item.wantInExchange}
            </p>
          </div>
        </div>

        {/* Owner Info */}
        {item.owner && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to={`/users/${item.owner._id || item.owner.id}`}
              className="flex items-center gap-2 group/user"
            >
              <Avatar src={item.owner.avatar} name={item.owner.name} size="sm" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 group-hover/user:text-indigo-600 transition truncate max-w-[130px]">
                  {item.owner.name}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{item.owner.college || item.owner.location}</span>
                </div>
              </div>
            </Link>

            <StarRating
              rating={item.owner.avgRating || 0}
              totalReviews={item.owner.totalReviews}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/items/${item._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </Link>

        {!isOwner && onSendRequest && (
          <button
            type="button"
            onClick={() => onSendRequest(item)}
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
