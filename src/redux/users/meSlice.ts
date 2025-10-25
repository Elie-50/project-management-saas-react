import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export type User = {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
};

type UserState = {
	user: User | null;
	loading: boolean;
	error: string | null;
};

const initialState: UserState = {
	user: null,
	loading: false,
	error: null
};

export const getMe = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('me/get', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to find user');
  }
});

export const deleteMe = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('me/delete', async (_, { rejectWithValue }) => {
  try {
    const response = await api.delete('/users/me');
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
  }
});

export const updateMe = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('me/update', async (_, { rejectWithValue }) => {
  try {
    const response = await api.patch('/users/me');
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to update user');
  }
});

const meSlice = createSlice({
	name: 'me',
	initialState,
	reducers: {
		clearMeState(state) {
			state.user = null;
			state.error = null;
			state.loading = false
		},
	},
	extraReducers: (builder) => {
		// GET
		builder.addCase(getMe.pending, (state) => {
			state.error = null;
			state.loading = true;
		})
		builder.addCase(getMe.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to get user'
		})
		builder.addCase(getMe.fulfilled, (state, action) => {
			state.user = action.payload
			state.loading = false
		})

		// PATCH
		builder.addCase(updateMe.pending, (state) => {
			state.error = null;
			state.loading = true;
		})
		builder.addCase(updateMe.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to get user'
		})
		builder.addCase(updateMe.fulfilled, (state, action) => {
			state.user = action.payload
			state.loading = false
		})

		// DELETE
		builder.addCase(deleteMe.pending, (state) => {
			state.error = null;
			state.loading = true;
		})
		builder.addCase(deleteMe.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to get user'
		})
		builder.addCase(deleteMe.fulfilled, (state) => {
			state.user = null
			state.loading = false
		})
	}
});

export const { clearMeState } = meSlice.actions;
export default meSlice.reducer;