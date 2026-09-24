import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { User, Skill, Item, Review } from '../types';
import { Avatar } from '../components/common/Avatar';
import { StarRating } from '../components/common/StarRating';
import { SkillCard } from '../components/cards/SkillCard';
import { ItemCard } from '../components/cards/ItemCard';
import { ReviewCard } from '../components/cards/ReviewCard';
import { ExchangeModal } from '../components/common/ExchangeModal';
import { ReportModal } from '../components/common/ReportModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  MapPin,
  Building,
  Calendar,
  BookOpen,
  Package,
  Star,
  Repeat,
  ArrowRightLeft,
  ShieldAlert,
  Edit,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'skills' | 'items' | 'reviews'>('skills');

  useEffect(() => {
    if (id) fetchProfile(id);
  }, [id]);

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const res = await userService.getUserById(userId);
      if (res.success) {
        setProfileUser(res.user);
        setSkills(res.skills);
        setItems(res.items);
        setReviews(res.reviews);
        setCompletedCount(res.completedExchangesCount);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading student profile..." />;
  if (!profileUser) return <div className="p-8 text-center text-slate-500">Student not found.</div>;

  const isOwnProfile = currentUser?._id === profileUser._id || currentUser?.id === profileUser._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar src={profileUser.avatar} name={profileUser.name} size="xl" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {profileUser.name}
                </h1>
                {profileUser.role === 'admin' && (
                  <span className="px-2.5 py-0.5 text-xs font-bold text-amber-800 bg-amber-100 rounded-full border border-amber-200">
                    Admin
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {profileUser.college}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profileUser.location}
                </span>
                <span className="flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5 text-indigo-500" />
                  {completedCount} Completed Swaps
                </span>
              </div>

              <div className="pt-1">
                <StarRating
                  rating={profileUser.avgRating || 0}
                  totalReviews={profileUser.totalReviews}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isOwnProfile ? (
              <Link
                to="/profile/edit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition w-full sm:w-auto justify-center"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.assign('/login');
                      return;
                    }
                    setExchangeModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition flex-1 sm:flex-initial justify-center"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Propose Exchange
                </button>

                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Report User"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {profileUser.bio && (
          <p className="mt-6 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed italic">
            "{profileUser.bio}"
          </p>
        )}

        {/* Skills & Items Wanted / Offered Tag Clouds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100/80">
            <span className="font-bold text-indigo-900 block mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Skills Offered
            </span>
            <div className="flex flex-wrap gap-1">
              {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 ? (
                profileUser.skillsOffered.map((s, idx) => (
                  <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-indigo-700 font-medium">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">None specified</span>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100/80">
            <span className="font-bold text-emerald-900 block mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Skills Wanted
            </span>
            <div className="flex flex-wrap gap-1">
              {profileUser.skillsWanted && profileUser.skillsWanted.length > 0 ? (
                profileUser.skillsWanted.map((s, idx) => (
                  <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-emerald-700 font-medium">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">None specified</span>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100/80">
            <span className="font-bold text-blue-900 block mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-600" /> Items Offered
            </span>
            <div className="flex flex-wrap gap-1">
              {profileUser.itemsOffered && profileUser.itemsOffered.length > 0 ? (
                profileUser.itemsOffered.map((i, idx) => (
                  <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-blue-700 font-medium">
                    {i}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">None specified</span>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100/80">
            <span className="font-bold text-purple-900 block mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-purple-600" /> Items Wanted
            </span>
            <div className="flex flex-wrap gap-1">
              {profileUser.itemsWanted && profileUser.itemsWanted.length > 0 ? (
                profileUser.itemsWanted.map((i, idx) => (
                  <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-purple-700 font-medium">
                    {i}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">None specified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Active Listings and Reviews */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'skills'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skills ({skills.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'items'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Items ({items.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'reviews'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'skills' && (
          <div>
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {skills.map(skill => (
                  <SkillCard key={skill._id} skill={skill} isOwner={isOwnProfile} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No active skills listed by this student.
              </div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(item => (
                  <ItemCard key={item._id} item={item} isOwner={isOwnProfile} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No active items listed by this student.
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(rev => (
                  <ReviewCard key={rev._id} review={rev} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No reviews yet for this student.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exchange Proposal Modal */}
      <ExchangeModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        targetUser={profileUser}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="User"
        targetId={profileUser._id}
        targetTitle={profileUser.name}
      />
    </div>
  );
};
