import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminStats, User, ExchangeRequest } from '../../types';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Package,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserX,
  Trash2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentExchanges, setRecentExchanges] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getStats();
      if (res.success) {
        setStats(res.stats);
        setRecentUsers(res.recentUsers);
        setRecentExchanges(res.recentExchanges);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading administrative metrics..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Platform Administration
          </div>
          <h1 className="text-3xl font-black text-slate-900">Admin Control Center</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/listings"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition"
          >
            Moderate Listings
          </Link>
          <Link
            to="/admin/reports"
            className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition"
          >
            Review Reports ({stats?.pendingReports || 0})
          </Link>
        </div>
      </div>

      {/* 6 Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Total Users
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalSkills || 0}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Skills Active
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalItems || 0}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Items Active
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Repeat className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-blue-600">{stats?.activeExchanges || 0}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Active Swaps
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-green-600">{stats?.completedExchanges || 0}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Completed Swaps
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-rose-600">{stats?.pendingReports || 0}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Reports Pending
          </div>
        </div>
      </div>

      {/* Two columns: Recent Registrations & Recent Platform Exchanges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Recent User Registrations
            </h3>
            <Link to="/admin/users" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentUsers.map(u => (
              <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                    <p className="text-[11px] text-slate-400">{u.email} • {u.college}</p>
                  </div>
                </div>
                {u.isDisabled && (
                  <span className="px-2 py-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 rounded-full border border-rose-200">
                    Disabled
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Platform Exchanges */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-indigo-600" />
              Latest Platform Swaps
            </h3>
            <span className="text-xs text-slate-400">Live activity</span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentExchanges.map(ex => (
              <div key={ex._id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {ex.sender.name} ↔ {ex.receiver.name}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                    {ex.offeredSkill?.name || ex.offeredItem?.name || ex.customOfferText}
                  </p>
                </div>
                <Badge
                  variant={
                    ex.status === 'Accepted'
                      ? 'accepted'
                      : ex.status === 'Completed'
                      ? 'completed'
                      : ex.status === 'Pending'
                      ? 'pending'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {ex.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
