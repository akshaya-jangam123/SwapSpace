import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { skillService } from '../services/skillService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BookOpen, ArrowRight } from 'lucide-react';

export const EditSkill: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming & Tech',
    description: '',
    level: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    availability: '',
    wantInExchange: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Programming & Tech',
    'Design & Creative',
    'Communication & Soft Skills',
    'Business & Analytics',
    'Languages & Tutoring',
    'Science & Engineering',
    'Other',
  ];

  useEffect(() => {
    if (id) {
      fetchSkill(id);
    }
  }, [id]);

  const fetchSkill = async (skillId: string) => {
    try {
      const res = await skillService.getSkillById(skillId);
      if (res.success && res.skill) {
        setFormData({
          name: res.skill.name,
          category: res.skill.category,
          description: res.skill.description,
          level: res.skill.level,
          availability: res.skill.availability,
          wantInExchange: res.skill.wantInExchange,
        });
      }
    } catch (err: any) {
      error(err.message || 'Failed to load skill.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      await skillService.updateSkill(id, formData);
      success('Skill updated successfully!');
      navigate(`/skills/${id}`);
    } catch (err: any) {
      error(err.message || 'Failed to update skill.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading skill..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Edit Skill Listing</h1>
            <p className="text-xs text-slate-500">Update your skill offering and exchange preferences.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Proficiency Level *
              </label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Practical application)</option>
                <option value="Advanced">Advanced (Deep mastery & coaching)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & What You Will Teach *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              What I Want in Exchange *
            </label>
            <input
              type="text"
              required
              value={formData.wantInExchange}
              onChange={e => setFormData({ ...formData, wantInExchange: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Availability *
            </label>
            <input
              type="text"
              required
              value={formData.availability}
              onChange={e => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
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
              {submitting ? 'Saving...' : 'Save Changes'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
