import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { itemService } from '../services/itemService';
import { matchService, ListingMatch } from '../services/matchService';
import { Item } from '../types';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { StarRating } from '../components/common/StarRating';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ExchangeModal } from '../components/common/ExchangeModal';
import { ReportModal } from '../components/common/ReportModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Package,
  ArrowRightLeft,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  ShieldAlert,
  Edit,
  Trash2,
} from 'lucide-react';

export const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [item, setItem] = useState<Item | null>(null);
  const [compatibleMatches, setCompatibleMatches] = useState<ListingMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItemData(id);
    }
  }, [id]);

  const fetchItemData = async (itemId: string) => {
    setLoading(true);
    try {
      const res = await itemService.getItemById(itemId);
      if (res.success && res.item) {
        setItem(res.item);
        // Fetch compatible listings
        try {
          const matchRes = await matchService.getListingMatches('item', itemId);
          if (matchRes.success) setCompatibleMatches(matchRes.matches);
        } catch (e) {
          console.error('Failed to load compatible matches:', e);
        }
      }
    } catch (err: any) {
      error(err.message || 'Failed to load item details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await itemService.deleteItem(id);
      success('Item listing deleted successfully.');
      navigate('/discover?type=items');
    } catch (err: any) {
      error(err.message || 'Failed to delete item.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading item details..." />;
  if (!item) return <div className="p-8 text-center text-slate-500">Item listing not found.</div>;

  const isOwner = user?._id === item.owner?._id || user?.id === item.owner?._id;

  const conditionVariant = {
    New: 'success',
    'Like New': 'primary',
    Good: 'secondary',
    Used: 'warning',
  }[item.condition] as any;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
        <Link to="/discover" className="hover:text-slate-600">Discover</Link>
        <span>/</span>
        <Link to="/discover?type=items" className="hover:text-slate-600">Items</Link>
        <span>/</span>
        <span className="text-slate-700 truncate">{item.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Item Info Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
            {/* Item Image */}
            {item.imageUrl && (
              <div className="relative h-72 sm:h-96 w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* Category and Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-lg">
                  {item.category}
                </span>
                <Badge variant={conditionVariant} size="md">
                  Condition: {item.condition}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
                {item.name}
              </h1>

              {/* What I want in exchange callout */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/30 border border-emerald-100 rounded-2xl mb-6">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950 uppercase tracking-wider mb-1">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                  What the owner wants in exchange:
                </div>
                <p className="text-sm font-bold text-emerald-800">{item.wantInExchange}</p>
              </div>

              {/* Description */}
              <div className="space-y-2 mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Item Description & Specifications
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Availability & Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    <strong className="text-slate-800">Availability:</strong> {item.availability}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>
                    <strong className="text-slate-800">Listed on:</strong>{' '}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compatible Swap Listings */}
          {compatibleMatches.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                Smart Compatibility
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Other Students Looking for This Item
              </h3>

              <div className="space-y-3">
                {compatibleMatches.map((cm, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cm.listing.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{cm.description}</p>
                    </div>
                    <Link
                      to={`/${cm.type === 'skill' ? 'skills' : 'items'}/${cm.listing._id}`}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition flex-shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Owner Profile & Action CTAs (1 col) */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            {!isOwner ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    setExchangeModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Request Item Exchange
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    setReportModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Report this Listing
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to={`/items/${item._id}/edit`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Item Listing
                </Link>

                <button
                  type="button"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Listing
                </button>
              </div>
            )}
          </div>

          {/* Owner Details Card */}
          {item.owner && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Listed By
              </div>

              <div className="flex items-center gap-3.5">
                <Avatar src={item.owner.avatar} name={item.owner.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <Link to={`/users/${item.owner._id || item.owner.id}`}>
                    <h4 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition truncate">
                      {item.owner.name}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{item.owner.college}</span>
                  </div>
                  <div className="mt-1">
                    <StarRating
                      rating={item.owner.avgRating || 0}
                      totalReviews={item.owner.totalReviews}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {item.owner.bio && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{item.owner.bio}"
                </p>
              )}

              <Link
                to={`/users/${item.owner._id || item.owner.id}`}
                className="block text-center py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50/60 rounded-xl transition"
              >
                View Student Profile & All Listings
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Exchange Modal */}
      {item.owner && (
        <ExchangeModal
          isOpen={exchangeModalOpen}
          onClose={() => setExchangeModalOpen(false)}
          targetUser={item.owner}
          targetItem={item}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="Item"
        targetId={item._id}
        targetTitle={item.name}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Item Listing"
        message="Are you sure you want to delete this item listing? This action cannot be undone."
        confirmText="Delete Listing"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};
