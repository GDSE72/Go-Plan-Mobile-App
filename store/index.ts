import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import tripReducer from './slices/tripSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        feed: feedReducer,
        trip: tripReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Important for Firebase User object usually
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
