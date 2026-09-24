import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { skillService } from '../services/skillService';
import { itemService } from '../services/itemService';
import { userService } from '../services/userService';
import { Skill, Item, User } from '../types';
import { SkillCard } from '../components/cards/SkillCard';
import { ItemCard } from '../components/cards/ItemCard';
import { UserCard } from '../components/cards/UserCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ExchangeModal } from '../components/common/ExchangeModal';
import {
  Search,
  Filter,
  BookOpen,
  Package,
  Users,
  SlidersHorizontal,
  X,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const Discover: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const activeTabParam = (searchParams.get('type') as 'skills' | 'items' | 'users') || 'skills';
  const [activeTab, setActiveTab] = useState<'skills' | 'items' | 'users'>(activeTabParam);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'All');
  const [conditionFilter, setConditionFilter] = useState(searchParams.get('condition') || 'All');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');

  // Data states
  const [skills, setSkills] = useState<Skill[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Exchange proposal modal
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState<any>(null);
  const [selectedTargetSkill, setSelectedTargetSkill] = useState<Skill | undefined>();
  const [selectedTargetItem, setSelectedTargetItem] = useState<Item | undefined>();

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  useEffect(() => {
    fetchResults();
  }, [activeTab, searchTerm, categoryFilter, levelFilter, conditionFilter, locationFilter]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      if (activeTab === 'skills') {
        const res = await skillService.getSkills({
          search: searchTerm || undefined,
          category: categoryFilter !== 'All' ? categoryFilter : undefined,
          level: levelFilter !== 'All' ? levelFilter : undefined,
          location: locationFilter || undefined,
        });
        if (res.success) setSkills(res.skills);
      } else if (activeTab === 'items') {
        const res = await itemService.getItems({
          search: searchTerm || undefined,
          category: categoryFilter !== 'All' ? categoryFilter : undefined,
          condition: conditionFilter !== 'All' ? conditionFilter : undefined,
          location: locationFilter || undefined,
        });
        if (res.success) setItems(res.items);
      } else if (activeTab === 'users') {
        const res = await userService.getUsers({
          search: searchTerm || undefined,
          location: locationFilter || undefined,
        });
        if (res.success) setUsers(res.users);
      }
    } catch (err) {
      console.error('Failed to fetch discovery listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'skills' | 'items' | 'users') => {
    setActiveTab(tab);
    setCategoryFilter('All');
    setLevelFilter('All');
    setConditionFilter('All');
    setSearchParams({ type: tab });
  };

  const handleOpenProposal = (target: Skill | Item | User, type: 'skill' | 'item' | 'user') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (type === 'skill') {
      const s = target as Skill;
      setSelectedTargetUser(s.owner);
      setSelectedTargetSkill(s);
      setSelectedTargetItem(undefined);
    } else if (type === 'item') {
      const i = target as Item;
      setSelectedTargetUser(i.owner);
      setSelectedTargetItem(i);
      setSelectedTargetSkill(undefined);
    } else {
      setSelectedTargetUser(target as User);
      setSelectedTargetSkill(undefined);
      setSelectedTargetItem(undefined);
    }
    setExchangeModalOpen(true);
  };

  const skillCategories = [
    'All',
    'Programming & Tech',
    'Design & Creative',
    'Communication & Soft Skills',
    'Business & Analytics',
    'Languages & Tutoring',
    'Science & Engineering',
    'Other',
  ];

  const itemCategories = [
    'All',
    'Books',
    'Electronics',
    'Study Materials',
    'Stationery',
    'Sports',
    'Accessories',
    'Other',
  ];

  const skillLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const itemConditions = ['All', 'New', 'Like New', 'Good', 'Used'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
          Search & Discover Swaps
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Explore peer skills, study essentials, and classmate profiles ready for exchange.
        </p>
      </div>

      {/* Main Search and Tabs Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm space-y-5">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab} by name, description, or exchange wish...`}
            className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTabChange('skills')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'skills'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Skills ({skills.length})
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('items')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'items'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              Items ({items.length})
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'users'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Students ({users.length})
            </button>
          </div>

          {/* Quick Location / College Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                placeholder="Filter by college/city..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters:
          </div>

          {/* Category Dropdown */}
          {activeTab !== 'users' && (
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {(activeTab === 'skills' ? skillCategories : itemCategories).map(cat => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          )}

          {/* Skill Level Dropdown */}
          {activeTab === 'skills' && (
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {skillLevels.map(lvl => (
                <option key={lvl} value={lvl}>
                  Level: {lvl}
                </option>
              ))}
            </select>
          )}

          {/* Item Condition Dropdown */}
          {activeTab === 'items' && (
            <select
              value={conditionFilter}
              onChange={e => setConditionFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {itemConditions.map(cond => (
                <option key={cond} value={cond}>
                  Condition: {cond}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters Button */}
          {(categoryFilter !== 'All' || levelFilter !== 'All' || conditionFilter !== 'All' || locationFilter || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setLevelFilter('All');
                setConditionFilter('All');
                setLocationFilter('');
              }}
              className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Results Content */}
      {loading ? (
        <LoadingSpinner message="Searching listings..." />
      ) : (
        <div>
          {/* Skills Grid */}
          {activeTab === 'skills' && (
            <div>
              {skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {skills.map(skill => (
                    <SkillCard
                      key={skill._id}
                      skill={skill}
                      isOwner={user?._id === skill.owner?._id}
                      onSendRequest={s => handleOpenProposal(s, 'skill')}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<BookOpen className="w-8 h-8 text-indigo-500" />}
                  title="No Skill Listings Found"
                  description="Try adjusting your search terms or filter criteria to discover more skills."
                  actionText="Reset Filters"
                  onAction={() => {
                    setSearchTerm('');
                    setCategoryFilter('All');
                    setLevelFilter('All');
                    setLocationFilter('');
                  }}
                />
              )}
            </div>
          )}

          {/* Items Grid */}
          {activeTab === 'items' && (
            <div>
              {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map(item => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      isOwner={user?._id === item.owner?._id}
                      onSendRequest={i => handleOpenProposal(i, 'item')}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Package className="w-8 h-8 text-emerald-500" />}
                  title="No Item Listings Found"
                  description="Try adjusting your search terms or filter criteria to discover more items."
                  actionText="Reset Filters"
                  onAction={() => {
                    setSearchTerm('');
                    setCategoryFilter('All');
                    setConditionFilter('All');
                    setLocationFilter('');
                  }}
                />
              )}
            </div>
          )}

          {/* Users Grid */}
          {activeTab === 'users' && (
            <div>
              {users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map(u => (
                    <UserCard
                      key={u._id}
                      user={u}
                      onInitiateSwap={u => handleOpenProposal(u, 'user')}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Users className="w-8 h-8 text-indigo-500" />}
                  title="No Students Found"
                  description="No registered students matched your search."
                  actionText="Reset Filters"
                  onAction={() => {
                    setSearchTerm('');
                    setLocationFilter('');
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}

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
