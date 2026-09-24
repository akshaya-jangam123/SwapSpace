import api from './api';
import { Skill } from '../types';

export interface SkillFilterParams {
  search?: string;
  category?: string;
  level?: string;
  location?: string;
  college?: string;
  page?: number;
  limit?: number;
}

export interface SkillPayload {
  name: string;
  category: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  availability: string;
  wantInExchange: string;
  isActive?: boolean;
}

export const skillService = {
  getSkills: async (params?: SkillFilterParams): Promise<{ success: boolean; count: number; skills: Skill[] }> => {
    const res = await api.get('/skills', { params });
    return res.data;
  },

  getSkillById: async (id: string): Promise<{ success: boolean; skill: Skill }> => {
    const res = await api.get(`/skills/${id}`);
    return res.data;
  },

  createSkill: async (payload: SkillPayload): Promise<{ success: boolean; message: string; skill: Skill }> => {
    const res = await api.post('/skills', payload);
    return res.data;
  },

  updateSkill: async (id: string, payload: Partial<SkillPayload>): Promise<{ success: boolean; message: string; skill: Skill }> => {
    const res = await api.put(`/skills/${id}`, payload);
    return res.data;
  },

  deleteSkill: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/skills/${id}`);
    return res.data;
  },

  getMySkills: async (): Promise<{ success: boolean; skills: Skill[] }> => {
    const res = await api.get('/skills/my/listings');
    return res.data;
  },
};
