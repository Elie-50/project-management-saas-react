import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import type { Organization } from './organizationSlice';

type UserMembership = {
	id: string;
	organization: Organization;
	joinedAt: Date;
};

type MembershipState = {
  memberships: UserMembership[];
  loading: boolean;
  error: string | null;
};

const initialState: MembershipState = {
  memberships: [],
  loading: false,
  error: null,
};

export const findAllMemberships = createAsyncThunk<
  UserMembership[],
  void,
  { rejectValue: string }
>('membership/findAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/me/memberships`);
		console.log(response.data);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
  }
});

export const addMemberToOrganization = createAsyncThunk<
  UserMembership[],
  void,
  { rejectValue: string }
>('membership/findAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/me/memberships`);
		console.log(response.data);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
  }
});

const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {
    clearMemberships(state) {
      state.memberships = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findAllMemberships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findAllMemberships.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships = action.payload;
      })
      .addCase(findAllMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch memberships';
      });
  },
});

export const { clearMemberships } = membershipSlice.actions;
export default membershipSlice.reducer;