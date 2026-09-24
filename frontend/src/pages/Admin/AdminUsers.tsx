import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { User } from '../../types';
import { Avatar } from '../../components/common/Avatar';
import { StarRating } from '../../components/common/StarRating';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Search, UserX, UserCheck, ShieldAlert, Shield } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { success, error } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Toggle user status dialog
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({ search: search || undefined });
      if (res.success) setUsers(res.users);
    } catch (err: any) {
      error(err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      const res = await adminService.toggleUserStatus(selectedUser._id || selectedUser.id || '');
      if (res.success) {
        success(res.message);
        fetchUsers();
      }
    } catch (err: any) {
      error(err.message || 'Failed to toggle user status.');
    } finally {
      setProcessing(false);
      setToggleDialogOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500">View and moderate all registered student accounts.</p>
        </div>
        <Link
          to="/admin"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200"
        >
          ← Back to Admin Console
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or college..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Fetching user directory..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">College & Location</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Avatar src={u.avatar} name={u.name} size="sm" />
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-slate-400 text-[11px]">{u.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{u.college}</div>
                      <div className="text-slate-400 text-[11px]">{u.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StarRating rating={u.avgRating || 0} totalReviews={u.totalReviews} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                          <Shield className="w-3 h-3 text-amber-600" /> Admin
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">User</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.isDisabled ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 rounded-full border border-rose-200">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(u);
                            setToggleDialogOpen(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            u.isDisabled
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          {u.isDisabled ? 'Re-enable' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={toggleDialogOpen}
        onClose={() => setToggleDialogOpen(false)}
        onConfirm={handleToggleStatus}
        title={selectedUser?.isDisabled ? 'Enable User Account' : 'Suspend User Account'}
        message={
          selectedUser?.isDisabled
            ? `Re-enabling ${selectedUser?.name}'s account will restore their ability to login and trade.`
            : `Suspending ${selectedUser?.name}'s account will prevent them from logging in and creating listings.`
        }
        confirmText={selectedUser?.isDisabled ? 'Re-enable User' : 'Suspend Account'}
        variant={selectedUser?.isDisabled ? 'primary' : 'danger'}
        loading={processing}
      />
    </div>
  );
};
