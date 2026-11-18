import { api } from './client';
import type { User } from '../types/user';

export const getUsers = (page: number, limit: number): Promise<User[]> =>
  api.get(`/users?page=${page}&limit=${limit}`).then(res => res.data);

export const getUserById = (id: string): Promise<User> =>
  api.get(`/users/${id}`).then(res => res.data);

export const createUser = (data: Partial<User>): Promise<User> =>
  api.post('/users', data).then(res => res.data);

export const updateUser = (id: string, data: Partial<User>): Promise<User> =>
  api.put(`/users/${id}`, data).then(res => res.data);