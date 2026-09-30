import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ErrorType, serializeError } from '../../core/errors';
import { logout } from '../auth/authSlice';
import { completeLesson } from '../courseDetails/courseDetailsSlice';

export const loadCourses = createAsyncThunk(
  'courses/load',
  async (_, { extra, dispatch, getState, rejectWithValue }) => {
    if (!getState().courses.items.length) {
      const cached = await extra.courseRepository.getCachedCourses();
      if (cached) {
        dispatch(cachedCoursesLoaded(cached));
      }
    }
    try {
      const result = await extra.courseRepository.getCourses();
      return { ...result, error: result.error && serializeError(result.error) };
    } catch (error) {
      const serialized = serializeError(error);
      if (serialized.type === ErrorType.UNAUTHORIZED) {
        dispatch(logout());
      }
      return rejectWithValue(serialized);
    }
  },
);

const initialState = {
  items: [],
  status: 'idle',
  isRefreshing: false,
  source: null,
  savedAt: null,
  error: null,
};

const applyResult = (state, { courses, source, savedAt }) => {
  state.items = courses;
  state.source = source;
  state.savedAt = savedAt;
  state.status = 'success';
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    cachedCoursesLoaded(state, { payload }) {
      applyResult(state, payload);
      state.isRefreshing = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadCourses.pending, state => {
        if (state.items.length) {
          state.isRefreshing = true;
        } else {
          state.status = 'loading';
        }
        state.error = null;
      })
      .addCase(loadCourses.fulfilled, (state, { payload }) => {
        applyResult(state, payload);
        state.isRefreshing = false;
        state.error = payload.error;
      })
      .addCase(loadCourses.rejected, (state, { payload, error }) => {
        state.isRefreshing = false;
        state.error = payload ?? serializeError(error);
        state.status = state.items.length ? 'success' : 'error';
      })
      .addCase(completeLesson.fulfilled, (state, { payload }) => {
        const course = state.items.find(item => item.id === payload.courseId);
        if (course && payload.progress != null) {
          course.progress = payload.progress;
        }
      })
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const { cachedCoursesLoaded } = coursesSlice.actions;
export const selectCourses = state => state.courses;
export const selectCourseById = (state, courseId) =>
  state.courses.items.find(course => course.id === courseId);
export default coursesSlice.reducer;
