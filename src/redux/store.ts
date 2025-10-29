import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import organizationReducer from './organizations/organizationSlice'
import meReducer from './users/meSlice'
import membershipsReducer from './organizations/membershipSlice'
import usersSearchReducer from './users/searchSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    me: meReducer,
    membership: membershipsReducer,
    usersSearch: usersSearchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;