// src/store/index.ts
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import progressReducer from './slices/progressSlice';
import readingReducer from './slices/readingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reading: readingReducer,
    progress: progressReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

const store = configureStore({
  reducer: {
    auth: authReducer,
    // ... other reducers if needed
  },
});

export default store;
