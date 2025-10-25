import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../urls';

type User = {
  id: string;
  email: string;
  username: string;
	firstName: string;
	lastName: string;
}

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

type SignupData = {
	email: string;
	password: string;
	username: string;
	lastName: string;
	firstName: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
};

export const signup = createAsyncThunk<
  { user: User },
  SignupData,
  { rejectValue: string }
>('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL + '/auth/signup', credentials);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Signup failed');
  }
});

export const login = createAsyncThunk<
  { accessToken: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL + '/auth/login', credentials);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      localStorage.removeItem('accessToken');
    },
    resetAccessToken(state) {
      state.accessToken = localStorage.getItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ accessToken: string }>) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', state.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout, resetAccessToken } = authSlice.actions;
export default authSlice.reducer;
