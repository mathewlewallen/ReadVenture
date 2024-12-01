import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // ... other reducers for logout, etc.
  },
});

export const { loginStart, loginSuccess, loginFailure } = authSlice.actions;
export default authSlice.reducer;