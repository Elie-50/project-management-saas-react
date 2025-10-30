import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import type { Organization } from './organizationSlice';
import type { User } from '../users/meSlice';

type UserMembership = {
	id: string;
	organization: Organization;
	joinedAt: Date;
};

type OrganizationMembers = {
  id: string;
  username: string;
  email: string;
  joinedAt: string;
};

type MembershipState = {
  memberships: UserMembership[];
  loading: boolean;
  error: string | null;
  membersIds: string[];
};

const initialState: MembershipState = {
  memberships: [],
  loading: false,
  error: null,
  membersIds: [],
};

export const findAllMemberships = createAsyncThunk<
  UserMembership[],
  void,
  { rejectValue: string }
>('membership/findAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/me/memberships`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
  }
});

export const findAllOrgMembers = createAsyncThunk<
  OrganizationMembers[],
  string,
  { rejectValue: string }
>('membership/orgMembers', async (orgId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/organizations/${orgId}/members`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
  }
});

type AddResponse = {
  id: string;
  organization: Organization;
  user: User;
  joinedAt: Date;
};

export const addMemberToOrganization = createAsyncThunk<
  AddResponse,
  { userId: string; orgId: string },
  { rejectValue: string }
>('membership/addToOrg', async ({ userId, orgId }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/organizations/${orgId}/members`, { userId });
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to add user to organizations');
  }
});

export const removeFromOrganization = createAsyncThunk<
  string,
  { userId: string; orgId: string },
  { rejectValue: string }
>('membership/remove', async ({ userId, orgId }, { rejectWithValue }) => {
  try {
    await api.delete(`/organizations/${orgId}/members/${userId}`,);
    return userId;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to add user to organizations');
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
      })

      .addCase(addMemberToOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.membersIds.push(action.payload.user.id)
      })
      .addCase(addMemberToOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch memberships';
      })

      .addCase(removeFromOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.membersIds = state.membersIds.filter(id => id !== action.payload)
      })
      .addCase(removeFromOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch memberships';
      })
      
      .addCase(findAllOrgMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findAllOrgMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.membersIds = action.payload.map((m) => m.id);
      })
      .addCase(findAllOrgMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch members';
      });
  },
});

export const { clearMemberships } = membershipSlice.actions;
export default membershipSlice.reducer;