import api from './api';
import { Message, ConversationItem } from '../types';

export const messageService = {
  sendMessage: async (exchangeId: string, content: string): Promise<{ success: boolean; message: Message }> => {
    const res = await api.post('/messages', { exchangeId, content });
    return res.data;
  },

  getExchangeMessages: async (exchangeId: string): Promise<{ success: boolean; count: number; messages: Message[] }> => {
    const res = await api.get(`/messages/${exchangeId}`);
    return res.data;
  },

  getConversationsList: async (): Promise<{ success: boolean; conversations: ConversationItem[] }> => {
    const res = await api.get('/messages/conversations/list');
    return res.data;
  },
};
