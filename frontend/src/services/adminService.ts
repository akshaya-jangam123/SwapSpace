import api from './api';
import { AdminStats, User, ExchangeRequest } from '../types';

export const adminService = {
  getStats: async (): Promise<{
    success: boolean;
    stats: AdminStats;
    recentUsers: User[];
    recentExchanges: ExchangeRequest[];
  }> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  getAllExchanges: async (): Promise<{ success: boolean; count: number; exchanges: ExchangeRequest[] }> => {
    const res = await api.get('/admin/exchanges');
    return res.data;
  },

  toggleUserStatus: async (id: string): Promise<{ success: boolean; message: string; user: { id: string; name: string; email: string; isDisabled: boolean } }> => {
    const res = await api.put(`/admin/users/${id}/toggle-status`);
    return res.data;
  },

  deleteSkill: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/admin/skills/${id}`);
    return res.data;
  },

  deleteItem: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/admin/items/${id}`);
    return res.data;
  },
};
