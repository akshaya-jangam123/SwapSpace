import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeftRight, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      success('Welcome back to SwapSpace!');
      navigate(from, { replace: true });
    } catch (err: any) {
      error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In to SwapSpace
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Enter your credentials to manage your listings and exchanges.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@college.edu"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            ⚡ Quick Demo Accounts (One-Click Fill)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('aarav@swapspace.dev')}
              className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl border border-slate-200/80 transition"
            >
              <span className="font-bold block">Aarav Sharma</span>
              <span className="text-[10px] text-slate-500">Java / CS Junior</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('priya@swapspace.dev')}
              className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl border border-slate-200/80 transition"
            >
              <span className="font-bold block">Priya Patel</span>
              <span className="text-[10px] text-slate-500">Python / ML</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('rohan@swapspace.dev')}
              className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl border border-slate-200/80 transition"
            >
              <span className="font-bold block">Rohan Gupta</span>
              <span className="text-[10px] text-slate-500">React / UI/UX</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@swapspace.dev')}
              className="p-2 text-left bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 transition"
            >
              <span className="font-bold block flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-600" /> Admin
              </span>
              <span className="text-[10px] text-amber-700">Platform Moderator</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
