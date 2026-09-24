import api from './api';
import { User } from '../types';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  college: string;
  location: string;
  bio?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  itemsOffered?: string[];
  itemsWanted?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },
};
