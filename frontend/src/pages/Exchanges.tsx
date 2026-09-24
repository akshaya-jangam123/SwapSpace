import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { exchangeService } from '../services/exchangeService';
import { ExchangeRequest } from '../types';
import { ExchangeCard } from '../components/cards/ExchangeCard';
import { ReviewModal } from '../components/common/ReviewModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Repeat, Inbox, Send, Filter } from 'lucide-react';

export const Exchanges: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedExchanges, setReceivedExchanges] = useState<ExchangeRequest[]>([]);
  const [sentExchanges, setSentExchanges] = useState<ExchangeRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState<ExchangeRequest | null>(null);

  // Dialog actions
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'cancel' | 'complete' | null>(null);
  const [targetExchangeId, setTargetExchangeId] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        exchangeService.getReceivedExchanges(),
        exchangeService.getSentExchanges(),
      ]);
      if (receivedRes.success) setReceivedExchanges(receivedRes.exchanges);
      if (sentRes.success) setSentExchanges(sentRes.exchanges);
    } catch (err: any) {
      error(err.message || 'Failed to fetch exchanges.');
    } finally {
      setLoading(false);
    }
  };

  const openActionDialog = (type: 'accept' | 'reject' | 'cancel' | 'complete', id: string) => {
    setActionType(type);
    setTargetExchangeId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!actionType || !targetExchangeId) return;
    setProcessing(true);

    try {
      if (actionType === 'accept') {
        await exchangeService.acceptExchange(targetExchangeId);
        success('Exchange request accepted! You can now chat and coordinate.');
      } else if (actionType === 'reject') {
        await exchangeService.rejectExchange(targetExchangeId);
        success('Exchange request declined.');
      } else if (actionType === 'cancel') {
        await exchangeService.cancelExchange(targetExchangeId);
        success('Exchange request cancelled.');
      } else if (actionType === 'complete') {
        await exchangeService.completeExchange(targetExchangeId);
        success('Exchange marked as completed! You can now rate your peer.');
      }
      fetchExchanges();
    } catch (err: any) {
      error(err.message || `Failed to ${actionType} exchange.`);
    } finally {
      setProcessing(false);
      setConfirmDialogOpen(false);
    }
  };

  const currentList = activeTab === 'received' ? receivedExchanges : sentExchanges;

  const filteredList = currentList.filter(ex => {
    if (statusFilter === 'All') return true;
    return ex.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Exchange Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review proposals, accept incoming trades, track ongoing swaps, and mark completed exchanges.
        </p>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'received'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Received Requests ({receivedExchanges.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'sent'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            Sent Requests ({sentExchanges.length})
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted (Active)</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <LoadingSpinner message="Loading your exchanges..." />
      ) : (
        <div>
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredList.map(exchange => (
                <ExchangeCard
                  key={exchange._id}
                  exchange={exchange}
                  currentUserId={user?._id || user?.id || ''}
                  isReceived={activeTab === 'received'}
                  onAccept={id => openActionDialog('accept', id)}
                  onReject={id => openActionDialog('reject', id)}
                  onCancel={id => openActionDialog('cancel', id)}
                  onComplete={id => openActionDialog('complete', id)}
                  onOpenReview={ex => {
                    setSelectedExchangeForReview(ex);
                    setReviewModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Repeat className="w-8 h-8 text-indigo-500" />}
              title={
                activeTab === 'received'
                  ? 'No Received Exchange Requests'
                  : 'No Sent Exchange Requests'
              }
              description={
                activeTab === 'received'
                  ? 'When other students propose a swap for your skills or items, they will appear here.'
                  : 'You have not sent any exchange proposals yet. Explore Discover to find swaps!'
              }
              actionText="Discover Swaps"
              onAction={() => window.location.assign('/discover')}
            />
          )}
        </div>
      )}

      {/* Review Modal */}
      {selectedExchangeForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          exchange={selectedExchangeForReview}
          currentUserId={user?._id || user?.id || ''}
          onSuccess={fetchExchanges}
        />
      )}

      {/* Action Confirmation Dialog */}
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
            ? 'Accepting this exchange will unlock chat messaging so you can coordinate handover details.'
            : actionType === 'reject'
            ? 'Are you sure you want to decline this proposal?'
            : actionType === 'cancel'
            ? 'Are you sure you want to withdraw your exchange request?'
            : 'Marking this exchange as completed will finalize the trade and allow both parties to leave ratings and feedback.'
        }
        confirmText={
          actionType === 'accept'
            ? 'Accept Swap'
            : actionType === 'reject'
            ? 'Decline'
            : actionType === 'cancel'
            ? 'Cancel Request'
            : 'Mark as Completed'
        }
        variant={
          actionType === 'reject' || actionType === 'cancel'
            ? 'danger'
            : actionType === 'complete'
            ? 'primary'
            : 'primary'
        }
        loading={processing}
      />
    </div>
  );
};
