import React, { useState } from 'react';
import { Modal } from './Modal';
import { StarRating } from './StarRating';
import { useToast } from '../../context/ToastContext';
import { reviewService } from '../../services/reviewService';
import { ExchangeRequest } from '../../types';
import { Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exchange: ExchangeRequest;
  currentUserId: string;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  exchange,
  currentUserId,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const otherUser =
    exchange.sender._id.toString() === currentUserId ? exchange.receiver : exchange.sender;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      error('Please provide a short feedback review.');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview(exchange._id, rating, comment.trim());
      success(`Review submitted for ${otherUser.name}!`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate & Review Exchange"
      subtitle={`Share your experience exchanging with ${otherUser.name}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating Picker */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select Rating
          </span>
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
            showNumber={false}
          />
          <span className="text-sm font-bold text-slate-800 mt-2">
            {rating === 5 && '🌟 Exceptional!'}
            {rating === 4 && '👍 Great Exchange!'}
            {rating === 3 && '👌 Average Experience'}
            {rating === 2 && '👎 Below Expectations'}
            {rating === 1 && '⚠️ Poor Experience'}
          </span>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Feedback & Review
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`How did the exchange go? Was ${otherUser.name} helpful, punctual, and friendly?`}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            <Star className="w-4 h-4 fill-white" />
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
