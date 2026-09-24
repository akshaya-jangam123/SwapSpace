import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { skillService } from '../../services/skillService';
import { itemService } from '../../services/itemService';
import { exchangeService } from '../../services/exchangeService';
import { Skill, Item, User } from '../../types';
import { ArrowLeftRight, Sparkles, BookOpen, Package } from 'lucide-react';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
  targetSkill?: Skill;
  targetItem?: Item;
  onSuccess?: () => void;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  targetSkill,
  targetItem,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loadingListings, setLoadingListings] = useState<boolean>(false);

  // Form state
  const [offerType, setOfferType] = useState<'skill' | 'item' | 'custom'>('skill');
  const [selectedOfferSkillId, setSelectedOfferSkillId] = useState<string>('');
  const [selectedOfferItemId, setSelectedOfferItemId] = useState<string>('');
  const [customOfferText, setCustomOfferText] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchMyListings();
      // Pre-fill intro message
      const targetName = targetSkill ? targetSkill.name : targetItem ? targetItem.name : 'your listing';
      setMessage(
        `Hi ${targetUser.name}! I would love to exchange for your "${targetName}". Let me know if you are interested!`
      );
    }
  }, [isOpen, user, targetSkill, targetItem, targetUser]);

  const fetchMyListings = async () => {
    setLoadingListings(true);
    try {
      const [skillsRes, itemsRes] = await Promise.all([
        skillService.getMySkills(),
        itemService.getMyItems(),
      ]);
      if (skillsRes.success) {
        const active = skillsRes.skills.filter(s => s.isActive);
        setMySkills(active);
        if (active.length > 0) setSelectedOfferSkillId(active[0]._id);
      }
      if (itemsRes.success) {
        const active = itemsRes.items.filter(i => i.isActive);
        setMyItems(active);
        if (active.length > 0) setSelectedOfferItemId(active[0]._id);
      }
    } catch (err: any) {
      console.error('Failed to load user listings:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      error('Please include an introductory message for your proposal.');
      return;
    }

    setSubmitting(true);
    try {
      const exchangeType = targetSkill ? (offerType === 'item' ? 'Mixed' : 'Skill') : (offerType === 'skill' ? 'Mixed' : 'Item');

      await exchangeService.createExchange({
        receiverId: targetUser._id,
        exchangeType: exchangeType as any,
        requestedSkill: targetSkill?._id,
        requestedItem: targetItem?._id,
        offeredSkill: offerType === 'skill' && selectedOfferSkillId ? selectedOfferSkillId : undefined,
        offeredItem: offerType === 'item' && selectedOfferItemId ? selectedOfferItemId : undefined,
        customOfferText: offerType === 'custom' ? customOfferText : undefined,
        message: message.trim(),
      });

      success('Exchange proposal sent successfully!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error(err.message || 'Failed to send exchange request.');
    } finally {
      setSubmitting(false);
    }
  };

  const targetTitle = targetSkill ? targetSkill.name : targetItem ? targetItem.name : 'Exchange Request';
  const targetRequirement = targetSkill?.wantInExchange || targetItem?.wantInExchange;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Propose an Exchange"
      subtitle={`Send a swap proposal to ${targetUser.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Summary Card */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-lg flex-shrink-0 mt-0.5">
            {targetSkill ? <BookOpen className="w-5 h-5" /> : <Package className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              {targetSkill ? 'Skill you are requesting' : 'Item you are requesting'}
            </span>
            <h4 className="text-base font-bold text-slate-900 truncate">{targetTitle}</h4>
            {targetRequirement && (
              <p className="text-xs text-slate-600 mt-1">
                <span className="font-semibold text-slate-700">They want in exchange:</span> {targetRequirement}
              </p>
            )}
          </div>
        </div>

        {/* Offer Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            What do you want to offer in exchange?
          </label>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setOfferType('skill')}
              className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition ${
                offerType === 'skill'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              My Skill ({mySkills.length})
            </button>

            <button
              type="button"
              onClick={() => setOfferType('item')}
              className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition ${
                offerType === 'item'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              My Item ({myItems.length})
            </button>

            <button
              type="button"
              onClick={() => setOfferType('custom')}
              className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition ${
                offerType === 'custom'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Custom Offer
            </button>
          </div>

          {/* Conditional Offer Inputs */}
          {offerType === 'skill' && (
            <div>
              {mySkills.length > 0 ? (
                <select
                  value={selectedOfferSkillId}
                  onChange={e => setSelectedOfferSkillId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {mySkills.map(skill => (
                    <option key={skill._id} value={skill._id}>
                      {skill.name} ({skill.level})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs leading-relaxed">
                  You haven't listed any active skills yet.{' '}
                  <span className="font-semibold">Switch to "Custom Offer"</span> to describe what you can offer.
                </div>
              )}
            </div>
          )}

          {offerType === 'item' && (
            <div>
              {myItems.length > 0 ? (
                <select
                  value={selectedOfferItemId}
                  onChange={e => setSelectedOfferItemId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {myItems.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} ({item.condition})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs leading-relaxed">
                  You haven't listed any active items yet.{' '}
                  <span className="font-semibold">Switch to "Custom Offer"</span> to describe what you can offer.
                </div>
              )}
            </div>
          )}

          {offerType === 'custom' && (
            <div>
              <input
                type="text"
                value={customOfferText}
                onChange={e => setCustomOfferText(e.target.value)}
                placeholder="e.g. 2 hours of React coaching or Scientific Calculator"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required={offerType === 'custom'}
              />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Introductory Message
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Explain why this swap would be great and when you are available to coordinate..."
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || loadingListings}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            <ArrowLeftRight className="w-4 h-4" />
            {submitting ? 'Sending Proposal...' : 'Send Exchange Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
