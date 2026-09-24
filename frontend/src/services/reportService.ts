import api from './api';
import { Report } from '../types';

export interface CreateReportPayload {
  targetType: 'User' | 'Skill' | 'Item' | 'Message';
  targetId: string;
  targetTitle?: string;
  reason: string;
  description: string;
}

export const reportService = {
  createReport: async (payload: CreateReportPayload): Promise<{ success: boolean; message: string; report: Report }> => {
    const res = await api.post('/reports', payload);
    return res.data;
  },

  getReports: async (status?: string): Promise<{ success: boolean; count: number; reports: Report[] }> => {
    const res = await api.get('/reports', { params: { status } });
    return res.data;
  },

  updateReportStatus: async (id: string, status: string, adminNotes?: string): Promise<{ success: boolean; message: string; report: Report }> => {
    const res = await api.put(`/reports/${id}`, { status, adminNotes });
    return res.data;
  },
};
