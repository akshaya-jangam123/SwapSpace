import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillService } from '../../services/skillService';
import { itemService } from '../../services/itemService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Skill, Item } from '../../types';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { BookOpen, Package, Trash2, Search, ExternalLink } from 'lucide-react';

export const AdminListings: React.FC = () => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'skills' | 'items'>('skills');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: 'skill' | 'item' } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [activeTab, search]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      if (activeTab === 'skills') {
        const res = await skillService.getSkills({ search: search || undefined });
        if (res.success) setSkills(res.skills);
      } else {
        const res = await itemService.getItems({ search: search || undefined });
        if (res.success) setItems(res.items);
      }
    } catch (err: any) {
      error(err.message || 'Failed to fetch listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'skill') {
        await adminService.deleteSkill(deleteTarget.id);
      } else {
        await adminService.deleteItem(deleteTarget.id);
      }
      success(`Listing "${deleteTarget.name}" removed by moderator.`);
      fetchListings();
    } catch (err: any) {
      error(err.message || 'Failed to delete listing.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Listings Moderation</h1>
          <p className="text-xs text-slate-500">
            Review, inspect, and remove inappropriate skills or physical item listings.
          </p>
        </div>
        <Link
          to="/admin"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200"
        >
          ← Back to Admin Console
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('skills');
              setSearch('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'skills'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Skill Listings ({skills.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('items');
              setSearch('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'items'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Item Listings ({items.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Fetching listings for moderation..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Title & Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Wanted in Exchange</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTab === 'skills'
                  ? skills.map(skill => (
                      <tr key={skill._id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{skill.name}</div>
                          <div className="text-slate-400 text-[11px] line-clamp-1 max-w-xs">
                            {skill.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700">{skill.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{skill.owner?.name}</div>
                          <div className="text-slate-400 text-[11px]">{skill.owner?.college}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-indigo-600 font-medium">{skill.wantInExchange}</span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link
                            to={`/skills/${skill._id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 inline-block transition"
                            title="View public listing"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget({ id: skill._id, name: skill.name, type: 'skill' });
                              setDeleteDialogOpen(true);
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg inline-block transition"
                            title="Moderator delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  : items.map(item => (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4 flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                            />
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{item.name}</div>
                            <div className="text-slate-400 text-[11px]">Condition: {item.condition}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700">{item.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{item.owner?.name}</div>
                          <div className="text-slate-400 text-[11px]">{item.owner?.college}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-600 font-medium">{item.wantInExchange}</span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link
                            to={`/items/${item._id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 inline-block transition"
                            title="View public listing"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget({ id: item._id, name: item.name, type: 'item' });
                              setDeleteDialogOpen(true);
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg inline-block transition"
                            title="Moderator delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteListing}
        title={`Remove ${deleteTarget?.type === 'skill' ? 'Skill' : 'Item'} Listing`}
        message={`Are you sure you want to remove "${deleteTarget?.name}" as a platform moderator?`}
        confirmText="Remove Listing"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};
