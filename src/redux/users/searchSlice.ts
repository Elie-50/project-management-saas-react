import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import type { User } from './meSlice';

type Response = {
	data: User[];
	total: number;
	page: number;
	pageCount: number;
};

const emptyData: Response = {
	data: [],
	page: 1,
	total: 0,
	pageCount: 0,
};

type UserSearchState = {
	data: Response;
	loading: boolean;
	error: string | null;
};

const initialState: UserSearchState = {
	data: emptyData,
	loading: false,
	error: null
};

export const searchUsers = createAsyncThunk<
  Response,
  { name: string; page: number; },
  { rejectValue: string }
>('usersSearch/find', async ({ name, page }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/search?q=${name}&page=${page}`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to find user');
  }
});

const usersSearchSlice = createSlice({
	name: 'usersSearch',
	initialState,
	reducers: {
		clearSearchState(state) {
			state.error = null;
			state.loading = false;
			state.data = emptyData;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(searchUsers.pending, (state) => {
			state.error = null;
			state.loading = true;
		})
		builder.addCase(searchUsers.rejected, (state, action) => {
			state.error = action.payload || 'Error fetching users';
			state.loading = false;
			state.data = emptyData;
		})
		builder.addCase(searchUsers.fulfilled, (state, action) => {
			state.error = null;
			state.loading = false;
			state.data = action.payload;
		})
	}
});

export const { clearSearchState } = usersSearchSlice.actions;
export default usersSearchSlice.reducer;