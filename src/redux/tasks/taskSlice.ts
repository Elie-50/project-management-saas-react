import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import type { User } from '../users/meSlice';

type Assignee = Omit<User, 'email'>;

export type Task = {
	id: string;
	name: string;
	description: string;
	status: 'To Do' | 'In Progress' | 'Done';
	color: string;
	projectId: string;
	createdAt: Date | string;
	dueDate: Date | string;
	updatedAt: Date | string;
	assigneeId?: string;
	assignee? : Assignee;
};


type TaskState = {
	selected: Task | null;
	tasks: Task[];
	loading: boolean;
	error: string | null;
};

const initialState: TaskState = {
	selected: null,
	tasks: [],
	loading: false,
	error: null,
};

export type CreateTaskDto = Omit<Task, 'createdAt' | 'updatedAt' | 'id' | 'assignee'>;
type UpdateTaskDto = Partial<Omit<Task, 'createdAt' | 'updatedAt'>>;

export const createTask = createAsyncThunk<
  Task,
  CreateTaskDto,
  { rejectValue: string }
>('tasks/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/tasks', data);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to create task');
  }
});

export const getTask = createAsyncThunk<
  Task,
  string,
  { rejectValue: string }
>('tasks/findOne', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to find task');
  }
});

export const updateTask = createAsyncThunk<
  Task,
  UpdateTaskDto,
  { rejectValue: string }
>('tasks/update', async (data, { rejectWithValue }) => {
  try {
		const { id, ...body } = data;
    const response = await api.patch(`/tasks/${id}`, body);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to update tasks');
  }
});

export const deleteTask = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
  }
});

export const findAllTasks = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>('tasks/findAllInProject', async (projectId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects/${projectId}/tasks`);
		console.log(response.data);
    return response.data;
  } catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
  }
});

const taskSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		clearTasksState(state) {
			state.error = null;
			state.tasks = [];
			state.selected = null;
			state.loading = false;
		},
		setSelectedTask (state, action) {
			state.selected = action.payload
		}
	},
	extraReducers: (builder) => {
		// ---- Create ----
		builder.addCase(createTask.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(createTask.fulfilled, (state, action) => {
			state.loading = false
			state.tasks.push(action.payload)
			state.selected = action.payload
		})
		builder.addCase(createTask.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to create task'
		})

		// ---- Get One ----
		builder.addCase(getTask.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(getTask.fulfilled, (state, action) => {
			state.loading = false
			state.selected = action.payload
		})
		builder.addCase(getTask.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to fetch task'
		})

		// ---- Delete ----
		builder.addCase(deleteTask.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(deleteTask.fulfilled, (state, action) => {
			state.loading = false
			// Remove from tasks
			state.tasks = state.tasks.filter(
				(item) => item.id !== action.meta.arg
			)
			// Deselect if selected was deleted
			if (state.selected?.id === action.meta.arg) {
				if (state.tasks.length > 0) {
					state.selected = state.tasks[0];
				} else {
					state.selected = null;
				}
			}
		})
		builder.addCase(deleteTask.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to delete task'
		})

		// ---- Update ----
		builder.addCase(updateTask.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(updateTask.fulfilled, (state, action) => {
			state.loading = false
			const updated = action.payload
			const index = state.tasks.findIndex((item) => item.id === updated.id)
			if (index !== -1) {
				state.tasks[index] = updated
			}
			let assignee; 
			if (state.selected?.assignee) {
				assignee = state.selected.assignee;
			}
			if (state.selected?.id === updated.id) {
				state.selected = updated
				state.selected.assignee = assignee
			}
		})
		builder.addCase(updateTask.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to update task'
		})

		// ---- Get All ----
		builder.addCase(findAllTasks.pending, (state) => {
			state.loading = true
			state.error = null
		})
		builder.addCase(findAllTasks.fulfilled, (state, action) => {
			state.loading = false
			state.tasks = action.payload
			state.selected = state.tasks[0]
		})
		builder.addCase(findAllTasks.rejected, (state, action) => {
			state.loading = false
			state.error = action.payload || 'Failed to fetch tasks'
		})
	},
});

export const { clearTasksState, setSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;