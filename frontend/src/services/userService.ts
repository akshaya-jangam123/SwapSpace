import api from './api';
import { User, Skill, Item, Review, DashboardStats, ExchangeRequest } from '../types';

export const userService = {
  getUserById: async (
    id: string
  ): Promise<{
    success: boolean;
    user: User;
    skills: Skill[];
    items: Item[];
    reviews: Review[];
    completedExchangesCount: number;
  }> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<{ success: boolean; message: string; user: User }> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  getUsers: async (params?: { search?: string; college?: string; location?: string }): Promise<{ success: boolean; count: number; users: User[] }> => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  getDashboardStats: async (): Promise<{
    success: boolean;
    stats: DashboardStats;
    recentActiveExchanges: ExchangeRequest[];
    mySkills: Skill[];
    myItems: Item[];
  }> => {
    const res = await api.get('/users/dashboard/stats');
    return res.data;
  },
};
