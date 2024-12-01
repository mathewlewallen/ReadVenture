import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import your auth slice reducer
// ... import other reducers (e.g., progressReducer)

const store = configureStore({
  reducer: {
    auth: authReducer,
    // ... other reducers
  },
});

export default store;