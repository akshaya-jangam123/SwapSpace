import api from './api';
import { ExchangeRequest, ExchangeType } from '../types';

export interface CreateExchangePayload {
  receiverId: string;
  exchangeType?: ExchangeType;
  offeredSkill?: string;
  offeredItem?: string;
  requestedSkill?: string;
  requestedItem?: string;
  customOfferText?: string;
  customRequestText?: string;
  message: string;
}

export const exchangeService = {
  createExchange: async (payload: CreateExchangePayload): Promise<{ success: boolean; message: string; exchange: ExchangeRequest }> => {
    const res = await api.post('/exchanges', payload);
    return res.data;
  },

  getSentExchanges: async (): Promise<{ success: boolean; count: number; exchanges: ExchangeRequest[] }> => {
    const res = await api.get('/exchanges/sent');
    return res.data;
  },

  getReceivedExchanges: async (): Promise<{ success: boolean; count: number; exchanges: ExchangeRequest[] }> => {
    const res = await api.get('/exchanges/received');
    return res.data;
  },

  getExchangeById: async (id: string): Promise<{ success: boolean; exchange: ExchangeRequest }> => {
    const res = await api.get(`/exchanges/${id}`);
    return res.data;
  },

  acceptExchange: async (id: string): Promise<{ success: boolean; message: string; exchange: ExchangeRequest }> => {
    const res = await api.put(`/exchanges/${id}/accept`);
    return res.data;
  },

  rejectExchange: async (id: string): Promise<{ success: boolean; message: string; exchange: ExchangeRequest }> => {
    const res = await api.put(`/exchanges/${id}/reject`);
    return res.data;
  },

  cancelExchange: async (id: string): Promise<{ success: boolean; message: string; exchange: ExchangeRequest }> => {
    const res = await api.put(`/exchanges/${id}/cancel`);
    return res.data;
  },

  completeExchange: async (id: string): Promise<{ success: boolean; message: string; exchange: ExchangeRequest }> => {
    const res = await api.put(`/exchanges/${id}/complete`);
    return res.data;
  },
};
