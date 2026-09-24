import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  Repeat,
  MessageSquare,
  BookOpen,
  Package,
  User,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/matches', label: 'Smart Matches', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { to: '/exchanges', label: 'My Exchanges', icon: <Repeat className="w-4 h-4" /> },
    { to: '/messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { to: '/create-skill', label: 'Offer Skill', icon: <BookOpen className="w-4 h-4 text-indigo-500" /> },
    { to: '/create-item', label: 'List Item', icon: <Package className="w-4 h-4 text-emerald-500" /> },
    { to: '/profile/edit', label: 'Edit Profile', icon: <User className="w-4 h-4" /> },
  ];

  if (isAdmin) {
    links.push({
      to: '/admin',
      label: 'Admin Panel',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
    });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Student Workspace
        </div>

        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* User Mini Card */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
          {user?.name?.[0] || 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
          <p className="text-[11px] text-slate-400 truncate">{user?.college}</p>
        </div>
      </div>
    </aside>
  );
};
