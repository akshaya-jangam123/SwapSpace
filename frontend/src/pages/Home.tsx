import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { skillService } from '../services/skillService';
import { itemService } from '../services/itemService';
import { Skill, Item } from '../types';
import { SkillCard } from '../components/cards/SkillCard';
import { ItemCard } from '../components/cards/ItemCard';
import { ExchangeModal } from '../components/common/ExchangeModal';
import { Hero3DBackground } from '../components/visuals/Hero3DBackground';
import {
  ArrowLeftRight,
  Sparkles,
  BookOpen,
  Package,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
  Zap,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Exchange proposal modal
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState<any>(null);
  const [selectedTargetSkill, setSelectedTargetSkill] = useState<Skill | undefined>();
  const [selectedTargetItem, setSelectedTargetItem] = useState<Item | undefined>();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [skillsRes, itemsRes] = await Promise.all([
          skillService.getSkills({ limit: 4 }),
          itemService.getItems({ limit: 4 }),
        ]);
        if (skillsRes.success) setSkills(skillsRes.skills);
        if (itemsRes.success) setItems(itemsRes.items);
      } catch (err) {
        console.error('Failed to load featured listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleRequestExchange = (listing: Skill | Item, type: 'skill' | 'item') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedTargetUser(listing.owner);
    if (type === 'skill') {
      setSelectedTargetSkill(listing as Skill);
      setSelectedTargetItem(undefined);
    } else {
      setSelectedTargetItem(listing as Item);
      setSelectedTargetSkill(undefined);
    }
    setExchangeModalOpen(true);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section with 3D Floating Environment */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#FAF8F5] border-b border-stone-200/70">
        {/* Realistic 3D Background Floating Objects */}
        <Hero3DBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-200/90 text-amber-900 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Peer-to-Peer College Exchange Platform
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-900 tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Swap Skills. <br />
            <span className="bg-gradient-to-r from-amber-700 via-rose-600 to-indigo-700 bg-clip-text text-transparent">
              Share Items.
            </span>{' '}
            Grow Together.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Exchange what you know and what you have with people who have what you need — completely cash-free.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/discover"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 rounded-2xl shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5"
            >
              <ArrowLeftRight className="w-5 h-5" />
              Explore Swaps
            </Link>

            <Link
              to={isAuthenticated ? '/create-skill' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-stone-800 bg-white/90 hover:bg-white border border-stone-200/90 rounded-2xl shadow-sm transition hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <Zap className="w-5 h-5 text-amber-600" />
              Create Listing
            </Link>
          </div>

          {/* Example Swaps Ticker */}
          <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-stone-700 bg-white/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-stone-200/80 shadow-3d-ambient">
            <span className="text-amber-800 font-bold">Popular Trades:</span>
            <span className="bg-stone-100/90 px-2.5 py-1 rounded-lg border border-stone-200/50">Java ↔ Python</span>
            <span>•</span>
            <span className="bg-stone-100/90 px-2.5 py-1 rounded-lg border border-stone-200/50">Web Dev ↔ Communication</span>
            <span>•</span>
            <span className="bg-stone-100/90 px-2.5 py-1 rounded-lg border border-stone-200/50">Engineering Book ↔ Calculator</span>
            <span>•</span>
            <span className="bg-stone-100/90 px-2.5 py-1 rounded-lg border border-stone-200/50">Tutoring ↔ Lab Coat</span>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900">500+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Active Students
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900">350+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Skills Shared
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900">420+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Items Listed
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900">98%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Successful Swaps
            </div>
          </div>
        </div>
      </section>

      {/* 3. How SwapSpace Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
            Simple 5-Step Process
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How SwapSpace Works
          </h3>
          <p className="text-slate-600 text-sm mt-3">
            A frictionless platform built for college peers to collaborate and exchange value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {[
            {
              step: '1',
              title: 'Create Profile',
              desc: 'Sign up with your college and specify what you can offer and what you are looking for.',
              icon: <Users className="w-5 h-5 text-indigo-600" />,
            },
            {
              step: '2',
              title: 'List Skill or Item',
              desc: 'Publish your skills or study essentials with what you expect in return.',
              icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
            },
            {
              step: '3',
              title: 'Find Your Match',
              desc: 'Our Smart Matching system highlights mutual and one-way match opportunities.',
              icon: <Flame className="w-5 h-5 text-amber-500" />,
            },
            {
              step: '4',
              title: 'Send Request',
              desc: 'Propose a swap with a personalized message and choose what you will provide.',
              icon: <ArrowLeftRight className="w-5 h-5 text-blue-600" />,
            },
            {
              step: '5',
              title: 'Complete & Review',
              desc: 'Coordinate via chat, finish the exchange, and build your platform reputation.',
              icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col items-start relative group hover:border-indigo-300 shadow-sm transition"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <div className="text-xs font-extrabold text-slate-400 mb-1">STEP 0{item.step}</div>
              <h4 className="text-base font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              Knowledge Exchange
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Skill Offers
            </h3>
          </div>

          <Link
            to="/discover?type=skills"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            View All Skills
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map(skill => (
            <SkillCard
              key={skill._id}
              skill={skill}
              onSendRequest={s => handleRequestExchange(s, 'skill')}
            />
          ))}
        </div>
      </section>

      {/* 5. Featured Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Package className="w-4 h-4" />
              Item Exchange
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Physical Items
            </h3>
          </div>

          <Link
            to="/discover?type=items"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            View All Items
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <ItemCard
              key={item._id}
              item={item}
              onSendRequest={i => handleRequestExchange(i, 'item')}
            />
          ))}
        </div>
      </section>

      {/* 6. Smart Matching Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-4 border border-amber-400/30">
              <Flame className="w-3.5 h-3.5" />
              Algorithm Powered
            </div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Never Search Manually. Let Smart Matching Connect You.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              SwapSpace automatically inspects what you want versus what your peers offer to calculate matching scores up to 98%.
            </p>
            <Link
              to={isAuthenticated ? '/matches' : '/register'}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Try Smart Matcher Now
            </Link>
          </div>
        </div>
      </section>

      {/* Exchange Proposal Modal */}
      {selectedTargetUser && (
        <ExchangeModal
          isOpen={exchangeModalOpen}
          onClose={() => setExchangeModalOpen(false)}
          targetUser={selectedTargetUser}
          targetSkill={selectedTargetSkill}
          targetItem={selectedTargetItem}
        />
      )}
    </div>
  );
};
