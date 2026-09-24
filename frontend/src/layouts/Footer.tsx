import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Heart, Sparkles, Shield, BookOpen, Package } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SwapSpace</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Peer-to-peer skill and item exchange platform for college students and lifelong learners. No money required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/discover?type=skills" className="hover:text-white transition flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link to="/discover?type=items" className="hover:text-white transition flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/discover?type=users" className="hover:text-white transition flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Student Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Exchanges & Matching */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/matches" className="hover:text-white transition">
                  Smart Matching
                </Link>
              </li>
              <li>
                <Link to="/exchanges" className="hover:text-white transition">
                  Active Exchanges
                </Link>
              </li>
              <li>
                <Link to="/messages" className="hover:text-white transition">
                  Peer Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Community</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">Campus Trust Guidelines</span>
              </li>
              <li>
                <span className="text-slate-400">Zero-Cash Fair Trading</span>
              </li>
              <li>
                <span className="text-slate-400">Student Verified Badges</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SwapSpace. Built for peer-to-peer knowledge & resource sharing.</p>
          <p className="flex items-center gap-1">
            Empowering students with <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Smart Swaps
          </p>
        </div>
      </div>
    </footer>
  );
};
