import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { skillService } from '../services/skillService';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export const CreateSkill: React.FC = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await skillService.createSkill(formData);
      success('Skill listing published successfully!');
      navigate(`/skills/${res.skill._id}`);
    } catch (err: any) {
      error(err.message || 'Failed to create skill listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Offer a Skill for Swap</h1>
            <p className="text-xs text-slate-500">
              Share what you can teach or mentor fellow classmates in exchange for knowledge.
            </p>
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
              placeholder="e.g. Java & Object-Oriented Programming, Graphic Design with Figma"
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
              placeholder="Detail what topics you can cover, your background, and how you prefer to teach (online, in-person, project-based)..."
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
              placeholder="e.g. Python tutoring, React help, or Scientific Calculator"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Be specific so our Smart Matching algorithm can automatically pair you with interested students.
            </p>
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
              placeholder="e.g. Weekends 2 PM - 6 PM, Tuesday & Thursday evenings"
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
              {submitting ? 'Publishing...' : 'Publish Skill Listing'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
