import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export type Organization = {
  id: string;
  name: string;
}

type OrganizationState = {
  selected: Organization | null;
	organizations: Organization[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  selected: null,
	organizations: [],
  loading: false,
  error: null
};

export const createOrganization = createAsyncThunk<
  Organization,
  string,
  { rejectValue: string }
>('organization/create', async (name, { rejectWithValue }) => {
  try {
    const response = await api.post('/organizations', { name });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to create organization');
  }
});

export const getOrganization = createAsyncThunk<
  Organization,
  string,
  { rejectValue: string }
>('organization/findOne', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to find organization');
  }
});

export const deleteOrganization = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('organization/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/organizations/${id}`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to delete organization');
  }
});

export const updateOrganization = createAsyncThunk<
  Organization,
  { id: string; name: string },
  { rejectValue: string }
>('organization/update', async ({ id, name }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/organizations/${id}`, { name });
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to update organizations');
  }
});

export const findAllOrganization = createAsyncThunk<
  Organization[],
  void,
  { rejectValue: string }
>('organization/findAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/organizations`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
  }
});

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setSelectedOrganization(state, action: PayloadAction<Organization | null>) {
      state.selected = action.payload
    },
    clearOrganizationState(state) {
      state.selected = null
      state.organizations = []
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // ---- Create ----
    builder.addCase(createOrganization.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createOrganization.fulfilled, (state, action) => {
      state.loading = false
      state.organizations.push(action.payload)
      state.selected = action.payload
    })
    builder.addCase(createOrganization.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || 'Failed to create organization'
    })

    // ---- Get One ----
    builder.addCase(getOrganization.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getOrganization.fulfilled, (state, action) => {
      state.loading = false
      state.selected = action.payload
    })
    builder.addCase(getOrganization.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || 'Failed to fetch organization'
    })

    // ---- Delete ----
    builder.addCase(deleteOrganization.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteOrganization.fulfilled, (state, action) => {
      state.loading = false
      // Remove from list
      state.organizations = state.organizations.filter(
        (org) => org.id !== action.meta.arg
      )
      // Deselect if selected was deleted
      if (state.selected?.id === action.meta.arg) {
        if (state.organizations.length > 0) {
          state.selected = state.organizations[0];
        } else {
          state.selected = null;
        }
      }
    })
    builder.addCase(deleteOrganization.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || 'Failed to delete organization'
    })

    // ---- Update ----
    builder.addCase(updateOrganization.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateOrganization.fulfilled, (state, action) => {
      state.loading = false
      const updated = action.payload
      const index = state.organizations.findIndex((org) => org.id === updated.id)
      if (index !== -1) {
        state.organizations[index] = updated
      }
      if (state.selected?.id === updated.id) {
        state.selected = updated
      }
    })
    builder.addCase(updateOrganization.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || 'Failed to update organization'
    })

    // ---- Get All ----
    builder.addCase(findAllOrganization.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(findAllOrganization.fulfilled, (state, action) => {
      state.loading = false
      state.organizations = action.payload
      state.selected = state.organizations[0]
    })
    builder.addCase(findAllOrganization.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || 'Failed to fetch organizations'
    })
  },
});

export const { setSelectedOrganization, clearOrganizationState } = organizationSlice.actions;
export default organizationSlice.reducer;