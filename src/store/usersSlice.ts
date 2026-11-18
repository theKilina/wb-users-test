import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as usersApi from '../api/users';
import type { User } from '../types/user';

interface UsersState {
  items: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  limit: number;
}

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
  page: 0,
  limit: 10,
};

export const fetchUsers = createAsyncThunk<
  User[], { page: number; limit: number }, { rejectValue: string }
>('users/fetch', async ({ page, limit }, { rejectWithValue }) => {
  try { return await usersApi.getUsers(page, limit); } 
  catch (e: any) { return rejectWithValue(e.message || 'Ошибка загрузки'); }
});

export const addUser = createAsyncThunk<
  User, Partial<User>, { rejectValue: string }
>('users/add', async (data, { rejectWithValue }) => {
  try { return await usersApi.createUser(data); } 
  catch (e: any) { return rejectWithValue(e.message || 'Ошибка создания'); }
});

export const editUser = createAsyncThunk<
  User, { id: string; data: Partial<User> }, { rejectValue: string }
>('users/edit', async ({ id, data }, { rejectWithValue }) => {
  try { return await usersApi.updateUser(id, data); } 
  catch (e: any) { return rejectWithValue(e.message || 'Ошибка обновления'); }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage(state, action) { state.page = action.payload; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload ?? 'Ошибка'; })
      .addCase(addUser.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(editUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { setPage, clearError } = usersSlice.actions;
export default usersSlice.reducer;