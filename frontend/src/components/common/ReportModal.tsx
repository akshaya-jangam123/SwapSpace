import React, { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from '../../context/ToastContext';
import { reportService } from '../../services/reportService';
import { ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'User' | 'Skill' | 'Item' | 'Message';
  targetId: string;
  targetTitle?: string;
  onSuccess?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [reason, setReason] = useState<string>('Inappropriate Content');
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      error('Please provide a brief description for this report.');
      return;
    }

    setSubmitting(true);
    try {
      await reportService.createReport({
        targetType,
        targetId,
        targetTitle,
        reason,
        description: description.trim(),
      });
      success('Report submitted. Our moderation team will investigate.');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Report ${targetType}`}
      subtitle={`Flag inappropriate behavior or content to moderators`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {targetTitle && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Target:</span> {targetTitle}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Reason for Report
          </label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="Inappropriate Content">Inappropriate or Offensive Content</option>
            <option value="Spam or Scam">Spam, Fraud, or Fake Listing</option>
            <option value="Harassment">Harassment or Abusive Conduct</option>
            <option value="Unfulfilled Exchange">Unfulfilled or Dishonest Exchange</option>
            <option value="Other">Other Policy Violation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Detailed Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Please provide specifics so our team can evaluate the report properly..."
            required
          />
        </div>

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
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            <ShieldAlert className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
