import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import { Report } from '../../types';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ShieldAlert, CheckCircle2, Clock, Eye, MessageSquare } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { success, error } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Resolution modal / note state
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getReports(statusFilter !== 'All' ? statusFilter : undefined);
      if (res.success) setReports(res.reports);
    } catch (err: any) {
      error(err.message || 'Failed to fetch reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, status: 'Reviewed' | 'Resolved') => {
    setUpdating(true);
    try {
      await reportService.updateReportStatus(reportId, status, adminNotes || undefined);
      success(`Report marked as ${status}.`);
      setSelectedReport(null);
      setAdminNotes('');
      fetchReports();
    } catch (err: any) {
      error(err.message || 'Failed to update report.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Moderation & Reports</h1>
          <p className="text-xs text-slate-500">
            Review user-submitted reports on inappropriate content or conduct.
          </p>
        </div>
        <Link
          to="/admin"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200"
        >
          ← Back to Admin Console
        </Link>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 text-xs bg-white p-3 rounded-2xl border border-slate-200 w-fit">
        <span className="font-bold text-slate-400 uppercase tracking-wider">Filter Status:</span>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-1 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
        >
          <option value="All">All Reports</option>
          <option value="Pending">Pending Only</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Reports List */}
      {loading ? (
        <LoadingSpinner message="Fetching user reports..." />
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map(report => (
            <div
              key={report._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    Target: {report.targetType}
                  </span>
                  <Badge
                    variant={
                      report.status === 'Pending'
                        ? 'pending'
                        : report.status === 'Resolved'
                        ? 'success'
                        : 'info'
                    }
                    size="sm"
                  >
                    {report.status}
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  Reason: {report.reason}
                </h3>

                {report.targetTitle && (
                  <p className="text-xs text-slate-600">
                    <strong>Target Item/Title:</strong> {report.targetTitle}
                  </p>
                )}

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{report.description}"
                </p>

                <div className="text-[11px] text-slate-400">
                  Reported by: <span className="font-semibold text-slate-700">{report.reporter?.name}</span> ({report.reporter?.email})
                </div>

                {report.adminNotes && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                    <strong>Admin Note:</strong> {report.adminNotes}
                  </div>
                )}
              </div>

              {/* Resolution Action */}
              {report.status === 'Pending' && (
                <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(report._id, 'Reviewed')}
                    disabled={updating}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                    disabled={updating}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
                  >
                    Resolve Report
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ShieldAlert className="w-8 h-8 text-emerald-500" />}
          title="No Moderation Reports"
          description="The platform is safe and clean. No pending user reports require attention."
        />
      )}
    </div>
  );
};
