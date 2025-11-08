import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import organizationReducer from './organizations/organizationSlice'
import meReducer from './users/meSlice'
import membershipsReducer from './organizations/membershipSlice'
import usersSearchReducer from './users/searchSlice'
import projectsReducer from './projects/projectSlice'
import tasksReducer from './tasks/taskSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    me: meReducer,
    membership: membershipsReducer,
    usersSearch: usersSearchReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;