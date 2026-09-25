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
  ChevronRight,
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Simple 5-Step Process
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How SwapSpace Works
          </h3>
          <p className="text-slate-600 text-sm mt-3">
            A frictionless platform built for college peers to collaborate and exchange value.
          </p>
        </div>

        <div className="relative">
          {/* Subtle Desktop Connecting Flow Track */}
          <div 
            className="hidden lg:block absolute top-1/2 left-6 right-6 h-[2px] -translate-y-6 bg-gradient-to-r from-indigo-200/50 via-purple-200/60 to-blue-200/50 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 relative z-10">
            {[
              {
                step: '1',
                title: 'Create Profile',
                desc: 'Sign up with your college and specify what you can offer and what you are looking for.',
                icon: <Users className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700 transition-colors" />,
                iconBg: 'bg-indigo-50/90 border-indigo-100/90 group-hover:bg-indigo-100/90 group-hover:border-indigo-200',
                accentGrad: 'from-indigo-500 to-indigo-600',
                badgeStyle: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/70',
                glowHover: 'group-hover:shadow-indigo-500/10 group-hover:border-indigo-300/80',
                delayClass: 'delay-100',
              },
              {
                step: '2',
                title: 'List Skill or Item',
                desc: 'Publish your skills or study essentials with what you expect in return.',
                icon: <BookOpen className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />,
                iconBg: 'bg-emerald-50/90 border-emerald-100/90 group-hover:bg-emerald-100/90 group-hover:border-emerald-200',
                accentGrad: 'from-emerald-500 to-emerald-600',
                badgeStyle: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/70',
                glowHover: 'group-hover:shadow-emerald-500/10 group-hover:border-emerald-300/80',
                delayClass: 'delay-200',
              },
              {
                step: '3',
                title: 'Find Your Match',
                desc: 'Our Smart Matching system highlights mutual and one-way match opportunities.',
                icon: <Flame className="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors" />,
                iconBg: 'bg-amber-50/90 border-amber-100/90 group-hover:bg-amber-100/90 group-hover:border-amber-200',
                accentGrad: 'from-amber-500 to-amber-600',
                badgeStyle: 'bg-amber-50/90 text-amber-700 border-amber-200/70',
                glowHover: 'group-hover:shadow-amber-500/10 group-hover:border-amber-300/80',
                delayClass: 'delay-300',
              },
              {
                step: '4',
                title: 'Send Request',
                desc: 'Propose a swap with a personalized message and choose what you will provide.',
                icon: <ArrowLeftRight className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />,
                iconBg: 'bg-blue-50/90 border-blue-100/90 group-hover:bg-blue-100/90 group-hover:border-blue-200',
                accentGrad: 'from-blue-500 to-blue-600',
                badgeStyle: 'bg-blue-50/90 text-blue-700 border-blue-200/70',
                glowHover: 'group-hover:shadow-blue-500/10 group-hover:border-blue-300/80',
                delayClass: 'delay-400',
              },
              {
                step: '5',
                title: 'Complete & Review',
                desc: 'Coordinate via chat, finish the exchange, and build your platform reputation.',
                icon: <CheckCircle2 className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />,
                iconBg: 'bg-purple-50/90 border-purple-100/90 group-hover:bg-purple-100/90 group-hover:border-purple-200',
                accentGrad: 'from-purple-500 to-purple-600',
                badgeStyle: 'bg-purple-50/90 text-purple-700 border-purple-200/70',
                glowHover: 'group-hover:shadow-purple-500/10 group-hover:border-purple-300/80',
                delayClass: 'delay-500',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`animate-step-reveal ${item.delayClass} bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between relative group transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl shadow-sm ${item.glowHover} overflow-hidden`}
              >
                {/* Subtle top accent gradient line on hover */}
                <div 
                  className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${item.accentGrad} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} 
                />

                {/* Card Top: Icon & Step Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className={`w-11 h-11 rounded-xl border ${item.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out`}>
                      {item.icon}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border shadow-2xs ${item.badgeStyle}`}>
                      STEP 0{item.step}
                    </span>
                  </div>

                  {/* Card Content */}
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors mb-2 tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Subtle desktop process flow arrow connector between cards */}
                {idx < 4 && (
                  <div 
                    className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm text-slate-400 items-center justify-center group-hover:text-indigo-600 group-hover:border-indigo-300 group-hover:scale-105 transition-all duration-300 pointer-events-none"
                    aria-hidden="true"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
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
