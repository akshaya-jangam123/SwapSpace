import api from './api';
import { Item, ItemCategory, ItemCondition } from '../types';

export interface ItemFilterParams {
  search?: string;
  category?: string;
  condition?: string;
  location?: string;
  college?: string;
  page?: number;
  limit?: number;
}

export interface ItemPayload {
  name: string;
  category: ItemCategory;
  description: string;
  condition: ItemCondition;
  imageUrl?: string;
  availability: string;
  wantInExchange: string;
  isActive?: boolean;
}

export const itemService = {
  getItems: async (params?: ItemFilterParams): Promise<{ success: boolean; count: number; items: Item[] }> => {
    const res = await api.get('/items', { params });
    return res.data;
  },

  getItemById: async (id: string): Promise<{ success: boolean; item: Item }> => {
    const res = await api.get(`/items/${id}`);
    return res.data;
  },

  createItem: async (payload: ItemPayload): Promise<{ success: boolean; message: string; item: Item }> => {
    const res = await api.post('/items', payload);
    return res.data;
  },

  updateItem: async (id: string, payload: Partial<ItemPayload>): Promise<{ success: boolean; message: string; item: Item }> => {
    const res = await api.put(`/items/${id}`, payload);
    return res.data;
  },

  deleteItem: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/items/${id}`);
    return res.data;
  },

  getMyItems: async (): Promise<{ success: boolean; items: Item[] }> => {
    const res = await api.get('/items/my/listings');
    return res.data;
  },
};
