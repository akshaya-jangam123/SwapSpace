import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { exchangeService } from '../services/exchangeService';
import { ExchangeRequest } from '../types';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { StarRating } from '../components/common/StarRating';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ReviewModal } from '../components/common/ReviewModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  ArrowLeftRight,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  MapPin,
  Sparkles,
  ArrowDown,
  BookOpen,
  Package,
} from 'lucide-react';

export const ExchangeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [exchange, setExchange] = useState<ExchangeRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Review & Dialog states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'cancel' | 'complete' | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) fetchExchange(id);
  }, [id]);

  const fetchExchange = async (exchangeId: string) => {
    setLoading(true);
    try {
      const res = await exchangeService.getExchangeById(exchangeId);
      if (res.success && res.exchange) {
        setExchange(res.exchange);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load exchange details.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!actionType || !id) return;
    setProcessing(true);
    try {
      if (actionType === 'accept') {
        await exchangeService.acceptExchange(id);
        success('Exchange proposal accepted! Chat unlocked.');
      } else if (actionType === 'reject') {
        await exchangeService.rejectExchange(id);
        success('Exchange proposal rejected.');
      } else if (actionType === 'cancel') {
        await exchangeService.cancelExchange(id);
        success('Exchange request cancelled.');
      } else if (actionType === 'complete') {
        await exchangeService.completeExchange(id);
        success('Exchange marked as completed!');
      }
      fetchExchange(id);
    } catch (err: any) {
      error(err.message || `Failed to ${actionType} exchange.`);
    } finally {
      setProcessing(false);
      setConfirmDialogOpen(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading exchange details..." />;
  if (!exchange) return <div className="p-8 text-center text-slate-500">Exchange not found.</div>;

  const currentUserId = user?._id || user?.id || '';
  const isSender = exchange.sender._id === currentUserId;
  const isReceiver = exchange.receiver._id === currentUserId;

  const statusVariant = {
    Pending: 'pending',
    Accepted: 'accepted',
    Rejected: 'rejected',
    Completed: 'completed',
    Cancelled: 'cancelled',
  }[exchange.status] as any;

  const senderOffer =
    exchange.offeredSkill?.name || exchange.offeredItem?.name || exchange.customOfferText || 'Skill / Item Offer';
  const receiverOffer =
    exchange.requestedSkill?.name ||
    exchange.requestedItem?.name ||
    exchange.customRequestText ||
    'Skill / Item Request';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Exchange Overview
            </span>
            <Badge variant={statusVariant} size="sm">
              {exchange.status}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {exchange.sender.name} ↔ {exchange.receiver.name}
          </h1>
        </div>

        {/* Top Chat link if accepted */}
        {exchange.status === 'Accepted' && (
          <Link
            to={`/messages?exchange=${exchange._id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
          >
            <MessageSquare className="w-4 h-4" />
            Open Exchange Chat
          </Link>
        )}
      </div>

      {/* Visual Exchange Flow Architecture (User A -> Offers -> Wants -> User B) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-6">
          Peer-to-Peer Exchange Model
        </h2>

        <div className="flex flex-col items-center space-y-4 max-w-lg mx-auto">
          {/* User A (Sender) Card */}
          <div className="w-full p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar src={exchange.sender.avatar} name={exchange.sender.name} size="md" />
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Proposer (User A)
                </span>
                <h4 className="text-sm font-bold text-slate-900">{exchange.sender.name}</h4>
                <p className="text-xs text-slate-500">{exchange.sender.college}</p>
              </div>
            </div>
            <StarRating rating={exchange.sender.avgRating || 0} size="sm" />
          </div>

          {/* Flow Down */}
          <div className="flex items-center justify-center text-indigo-500 font-bold text-xs gap-1 py-1">
            <ArrowDown className="w-4 h-4 animate-bounce" /> Offers to Exchange
          </div>

          {/* User A Offers Item/Skill */}
          <div className="w-full p-4 rounded-2xl bg-white border-2 border-indigo-400 shadow-sm text-center">
            <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider block mb-1">
              {exchange.offeredSkill ? 'Skill Provided' : exchange.offeredItem ? 'Item Provided' : 'Custom Offer'}
            </span>
            <h3 className="text-base font-black text-slate-900">{senderOffer}</h3>
            {exchange.offeredSkill && (
              <p className="text-xs text-slate-500 mt-1">Level: {exchange.offeredSkill.level}</p>
            )}
            {exchange.offeredItem && (
              <p className="text-xs text-slate-500 mt-1">Condition: {exchange.offeredItem.condition}</p>
            )}
          </div>

          {/* Flow Down */}
          <div className="flex items-center justify-center text-emerald-600 font-bold text-xs gap-1 py-1">
            <ArrowLeftRight className="w-4 h-4 text-emerald-600" /> In Exchange For
          </div>

          {/* User B Provides Item/Skill */}
          <div className="w-full p-4 rounded-2xl bg-white border-2 border-emerald-400 shadow-sm text-center">
            <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">
              {exchange.requestedSkill ? 'Requested Skill' : exchange.requestedItem ? 'Requested Item' : 'Custom Request'}
            </span>
            <h3 className="text-base font-black text-slate-900">{receiverOffer}</h3>
            {exchange.requestedSkill && (
              <p className="text-xs text-slate-500 mt-1">Level: {exchange.requestedSkill.level}</p>
            )}
            {exchange.requestedItem && (
              <p className="text-xs text-slate-500 mt-1">Condition: {exchange.requestedItem.condition}</p>
            )}
          </div>

          {/* Flow Down */}
          <div className="flex items-center justify-center text-emerald-500 font-bold text-xs gap-1 py-1">
            <ArrowDown className="w-4 h-4 animate-bounce" /> Provided By
          </div>

          {/* User B (Receiver) Card */}
          <div className="w-full p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar src={exchange.receiver.avatar} name={exchange.receiver.name} size="md" />
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Recipient (User B)
                </span>
                <h4 className="text-sm font-bold text-slate-900">{exchange.receiver.name}</h4>
                <p className="text-xs text-slate-500">{exchange.receiver.college}</p>
              </div>
            </div>
            <StarRating rating={exchange.receiver.avgRating || 0} size="sm" />
          </div>
        </div>

        {/* Introductory Proposal Message */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 mt-6">
          <span className="font-bold text-slate-900 block mb-1">Introductory Message from {exchange.sender.name}:</span>
          "{exchange.message}"
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-slate-100">
          <span>Created on {new Date(exchange.createdAt).toLocaleString()}</span>
          <span>Last updated: {new Date(exchange.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/exchanges"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          ← Back to All Exchanges
        </Link>

        <div className="flex items-center gap-3">
          {/* Receiver Actions when Pending */}
          {exchange.status === 'Pending' && isReceiver && (
            <>
              <button
                type="button"
                onClick={() => {
                  setActionType('reject');
                  setConfirmDialogOpen(true);
                }}
                className="px-4 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition"
              >
                Decline Proposal
              </button>

              <button
                type="button"
                onClick={() => {
                  setActionType('accept');
                  setConfirmDialogOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept Exchange
              </button>
            </>
          )}

          {/* Sender Cancel when Pending */}
          {exchange.status === 'Pending' && isSender && (
            <button
              type="button"
              onClick={() => {
                setActionType('cancel');
                setConfirmDialogOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              Cancel My Request
            </button>
          )}

          {/* Accepted actions: Complete */}
          {exchange.status === 'Accepted' && (isSender || isReceiver) && (
            <button
              type="button"
              onClick={() => {
                setActionType('complete');
                setConfirmDialogOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Exchange as Completed
            </button>
          )}

          {/* Completed: Rate & Review */}
          {exchange.status === 'Completed' && (
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition"
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              Leave Rating & Review
            </button>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        exchange={exchange}
        currentUserId={currentUserId}
        onSuccess={() => id && fetchExchange(id)}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          actionType === 'accept'
            ? 'Accept Exchange Proposal'
            : actionType === 'reject'
            ? 'Decline Exchange Request'
            : actionType === 'cancel'
            ? 'Cancel Exchange Request'
            : 'Complete Exchange'
        }
        message={
          actionType === 'accept'
            ? 'Accepting this exchange will unlock chat messaging so you can coordinate details.'
            : actionType === 'reject'
            ? 'Are you sure you want to decline this proposal?'
            : actionType === 'cancel'
            ? 'Are you sure you want to withdraw your exchange request?'
            : 'Marking this exchange as completed will finalize the swap.'
        }
        confirmText={
          actionType === 'accept'
            ? 'Accept Swap'
            : actionType === 'reject'
            ? 'Decline'
            : actionType === 'cancel'
            ? 'Cancel'
            : 'Mark as Completed'
        }
        variant={actionType === 'reject' || actionType === 'cancel' ? 'danger' : 'primary'}
        loading={processing}
      />
    </div>
  );
};
