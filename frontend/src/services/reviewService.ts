import api from './api';
import { Review } from '../types';

export const reviewService = {
  createReview: async (exchangeId: string, rating: number, comment: string): Promise<{ success: boolean; message: string; review: Review }> => {
    const res = await api.post('/reviews', { exchangeId, rating, comment });
    return res.data;
  },

  getUserReviews: async (userId: string): Promise<{ success: boolean; count: number; reviews: Review[] }> => {
    const res = await api.get(`/reviews/user/${userId}`);
    return res.data;
  },

  getMyReviews: async (): Promise<{ success: boolean; received: Review[]; given: Review[] }> => {
    const res = await api.get('/reviews/my/all');
    return res.data;
  },
};
