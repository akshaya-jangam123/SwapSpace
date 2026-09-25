import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 selection:bg-amber-200 selection:text-stone-900 relative">
      {/* Global Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-peach-100/30 blur-3xl opacity-60" />
        <div className="absolute top-1/3 left-0 w-[450px] h-[450px] rounded-full bg-lavender-100/30 blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-sage-100/35 blur-3xl opacity-50" />
      </div>

      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
