import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import organizationReducer from './organizations/organizationSlice'
import meReducer from './users/meSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    me: meReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;