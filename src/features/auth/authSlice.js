import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeError } from '../../core/errors';

export const AuthStatus = {
  RESTORING: 'restoring',
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
};

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { extra }) => {
    try {
      return await extra.authRepository.restoreSession();
    } catch {
      return null;
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { extra, rejectWithValue }) => {
    try {
      return await extra.authRepository.login(email, password);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, { extra }) => {
  await Promise.allSettled([
    extra.authRepository.logout(),
    extra.courseRepository.clear(),
  ]);
});

const initialState = { status: AuthStatus.RESTORING, user: null, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authErrorCleared(state) {
      state.error = null;
      if (state.status === AuthStatus.ERROR) {
        state.status = AuthStatus.IDLE;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.status = AuthStatus.IDLE;
        state.user = payload;
      })
      .addCase(login.pending, state => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = AuthStatus.IDLE;
        state.user = payload;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = AuthStatus.ERROR;
        state.error = payload ?? serializeError();
      })
      .addCase(logout.fulfilled, () => ({
        ...initialState,
        status: AuthStatus.IDLE,
      }));
  },
});

export const { authErrorCleared } = authSlice.actions;
export const selectAuth = state => state.auth;
export default authSlice.reducer;
