import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { User, Building, MapPin, Image, Save, ArrowRight } from 'lucide-react';

export const MyProfile: React.FC = () => {
  const { user, updateCurrentUserState } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    location: '',
    bio: '',
    avatar: '',
    skillsOfferedStr: '',
    skillsWantedStr: '',
    itemsOfferedStr: '',
    itemsWantedStr: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        skillsOfferedStr: (user.skillsOffered || []).join(', '),
        skillsWantedStr: (user.skillsWanted || []).join(', '),
        itemsOfferedStr: (user.itemsOffered || []).join(', '),
        itemsWantedStr: (user.itemsWanted || []).join(', '),
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const skillsOffered = formData.skillsOfferedStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const skillsWanted = formData.skillsWantedStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const itemsOffered = formData.itemsOfferedStr
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);
    const itemsWanted = formData.itemsWantedStr
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    try {
      const res = await userService.updateUser(user._id || user.id || '', {
        name: formData.name.trim(),
        college: formData.college.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim(),
        skillsOffered,
        skillsWanted,
        itemsOffered,
        itemsWanted,
      });

      if (res.success) {
        updateCurrentUserState(res.user);
        success('Profile updated successfully!');
        navigate(`/users/${user._id || user.id}`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Edit Your Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Update your public information, bio, and trading preferences for the smart matching algorithm.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Avatar / Photo URL
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College / University *
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Campus *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              About You & Bio
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell others what you study, what you are passionate about, and your exchange goals..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tag preferences */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Smart Matching Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
                  Skills Offered (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsOfferedStr}
                  onChange={e => setFormData({ ...formData, skillsOfferedStr: e.target.value })}
                  placeholder="Java, Python, Graphic Design, Public Speaking"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5">
                  Skills Wanted (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsWantedStr}
                  onChange={e => setFormData({ ...formData, skillsWantedStr: e.target.value })}
                  placeholder="React, Machine Learning, UI/UX, Video Editing"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
                  Items Offered (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.itemsOfferedStr}
                  onChange={e => setFormData({ ...formData, itemsOfferedStr: e.target.value })}
                  placeholder="Calculators, Arduino Kits, Engineering Textbooks"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider mb-1.5">
                  Items Wanted (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.itemsWantedStr}
                  onChange={e => setFormData({ ...formData, itemsWantedStr: e.target.value })}
                  placeholder="USB Drives, Chemistry Lab Coats, Mechanical Keyboards"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
