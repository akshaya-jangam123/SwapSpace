import React from 'react';
import { Link } from 'react-router-dom';
import { ExchangeRequest } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import {
  ArrowRightLeft,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface ExchangeCardProps {
  exchange: ExchangeRequest;
  currentUserId: string;
  isReceived: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onOpenReview?: (exchange: ExchangeRequest) => void;
}

export const ExchangeCard: React.FC<ExchangeCardProps> = ({
  exchange,
  currentUserId,
  isReceived,
  onAccept,
  onReject,
  onCancel,
  onComplete,
  onOpenReview,
}) => {
  const otherUser = isReceived ? exchange.sender : exchange.receiver;

  const statusVariant = {
    Pending: 'pending',
    Accepted: 'accepted',
    Rejected: 'rejected',
    Completed: 'completed',
    Cancelled: 'cancelled',
  }[exchange.status] as any;

  const offeredTitle =
    exchange.offeredSkill?.name || exchange.offeredItem?.name || exchange.customOfferText || 'Skill / Item';
  const requestedTitle =
    exchange.requestedSkill?.name ||
    exchange.requestedItem?.name ||
    exchange.customRequestText ||
    'Skill / Item';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between transition hover:shadow-md">
      <div>
        {/* Header: Other User & Status Badge */}
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Avatar src={otherUser?.avatar} name={otherUser?.name || 'User'} size="md" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {isReceived ? 'Request from' : 'Request sent to'}
              </span>
              <Link to={`/users/${otherUser?._id}`}>
                <h4 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition">
                  {otherUser?.name}
                </h4>
              </Link>
              <p className="text-xs text-slate-500">{otherUser?.college}</p>
            </div>
          </div>

          <Badge variant={statusVariant} size="md">
            {exchange.status}
          </Badge>
        </div>

        {/* Exchange Diagram: Offered <-> Requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block mb-1">
              {isReceived ? 'They Offer' : 'You Offer'}
            </span>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">{offeredTitle}</p>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
              {isReceived ? 'They Want' : 'You Want'}
            </span>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">{requestedTitle}</p>
          </div>
        </div>

        {/* Message */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
          <span className="font-semibold text-slate-700">Proposal message:</span> "{exchange.message}"
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Created on {new Date(exchange.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <Link
          to={`/exchanges/${exchange._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          View Full Details
        </Link>

        <div className="flex items-center gap-2">
          {/* Pending Received: Accept / Reject */}
          {exchange.status === 'Pending' && isReceived && (
            <>
              {onReject && (
                <button
                  type="button"
                  onClick={() => onReject(exchange._id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Decline
                </button>
              )}
              {onAccept && (
                <button
                  type="button"
                  onClick={() => onAccept(exchange._id)}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Accept Swap
                </button>
              )}
            </>
          )}

          {/* Pending Sent: Cancel */}
          {exchange.status === 'Pending' && !isReceived && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(exchange._id)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            >
              Cancel Request
            </button>
          )}

          {/* Accepted: Chat + Complete */}
          {exchange.status === 'Accepted' && (
            <>
              <Link
                to={`/messages?exchange=${exchange._id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat Now
              </Link>
              {onComplete && (
                <button
                  type="button"
                  onClick={() => onComplete(exchange._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Completed
                </button>
              )}
            </>
          )}

          {/* Completed: Rate & Review */}
          {exchange.status === 'Completed' && onOpenReview && (
            <button
              type="button"
              onClick={() => onOpenReview(exchange)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Rate & Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
