import api from '@/lib/api';
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export type Project = {
	id: string;
	name: string;
};

type ProjectState = {
	projects: Project[];
	selected: Project | null;
	error: string | null;
	loading: boolean;
};

const initialState: ProjectState = {
	projects: [],
	selected: null,
	error: null,
	loading: false,
};

export const createProject = createAsyncThunk<
  Project,
  { organizationId: string; name: string; },
  { rejectValue: string }
>('projects/create', async ({ organizationId, name }, { rejectWithValue }) => {
  try {
    const response = await api.post('/projects', { organizationId, name });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to create project');
  }
});

export const getProject = createAsyncThunk<
  Project,
  string,
  { rejectValue: string }
>('projects/findOne', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to find project');
  }
});

export const updateProject = createAsyncThunk<
  Project,
  { id: string; name: string },
  { rejectValue: string }
>('projects/update', async ({ id, name }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/projects/${id}`, { name });
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to update project');
  }
});

export const deleteProject = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
  }
});

export const findAllProjects = createAsyncThunk<
  Project[],
  string,
  { rejectValue: string }
>('projects/findAll', async (organizationId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/organizations/${organizationId}/projects`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
  }
});

const projectSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		clearProjectState (state) {
			state.error = null;
			state.loading = false;
			state.projects = [];
			state.selected = null;
		},
		setSelectedProject(state, action: PayloadAction<Project | null>) {
			state.selected = action.payload
		},
	},
	extraReducers: (builder) => {
		// ---- Create ----
		builder.addCase(createProject.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(createProject.fulfilled, (state, action) => {
			state.loading = false
			state.projects.push(action.payload)
			state.selected = action.payload
		})
		builder.addCase(createProject.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to create project'
		})

		// ---- Get One ----
		builder.addCase(getProject.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(getProject.fulfilled, (state, action) => {
			state.loading = false
			state.selected = action.payload
		})
		builder.addCase(getProject.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to fetch project'
		})

		// ---- Delete ----
		builder.addCase(deleteProject.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(deleteProject.fulfilled, (state, action) => {
			state.loading = false
			// Remove from list
			state.projects = state.projects.filter(
				(item) => item.id !== action.meta.arg
			)
			// Deselect if selected was deleted
			if (state.selected?.id === action.meta.arg) {
				if (state.projects.length > 0) {
					state.selected = state.projects[0];
				} else {
					state.selected = null;
				}
			}
		})
		builder.addCase(deleteProject.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to delete project'
		})

		// ---- Update ----
		builder.addCase(updateProject.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(updateProject.fulfilled, (state, action) => {
			state.loading = false
			const updated = action.payload
			const index = state.projects.findIndex((item) => item.id === updated.id)
			if (index !== -1) {
				state.projects[index] = updated
			}
			if (state.selected?.id === updated.id) {
				state.selected = updated
			}
		})
		builder.addCase(updateProject.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to update project'
		})

		// ---- Get All ----
		builder.addCase(findAllProjects.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(findAllProjects.fulfilled, (state, action) => {
			state.loading = false
			state.projects = action.payload
			state.selected = state.projects[0]
		})
		builder.addCase(findAllProjects.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to fetch projects'
		})
	},
});

export const { setSelectedProject, clearProjectState } = projectSlice.actions;
export default projectSlice.reducer;