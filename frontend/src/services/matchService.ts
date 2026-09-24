import api from './api';
import { MatchResult } from '../types';

export interface ListingMatch {
  listing: any;
  type: 'skill' | 'item';
  score: number;
  matchType: 'perfect' | 'one-way' | 'partial';
  description: string;
}

export const matchService = {
  getSmartMatches: async (): Promise<{
    success: boolean;
    totalMatches: number;
    perfectCount: number;
    oneWayCount: number;
    perfectMatches: MatchResult[];
    oneWayMatches: MatchResult[];
    allMatches: MatchResult[];
  }> => {
    const res = await api.get('/matches');
    return res.data;
  },

  getListingMatches: async (type: 'skill' | 'item', id: string): Promise<{ success: boolean; matches: ListingMatch[] }> => {
    const res = await api.get(`/matches/listing/${type}/${id}`);
    return res.data;
  },
};
