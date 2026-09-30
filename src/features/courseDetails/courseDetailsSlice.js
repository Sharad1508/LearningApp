import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeError } from '../../core/errors';
import { markLessonCompleted } from '../../domain/progress';
import { logout } from '../auth/authSlice';

export const loadCourseDetails = createAsyncThunk(
  'courseDetails/load',
  async (courseId, { extra, rejectWithValue }) => {
    try {
      const result = await extra.courseRepository.getCourseDetails(courseId);
      return { ...result, error: result.error && serializeError(result.error) };
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  },
);

export const completeLesson = createAsyncThunk(
  'courseDetails/completeLesson',
  async ({ courseId, lessonId }, { extra, rejectWithValue }) => {
    try {
      return await extra.courseRepository.completeLesson(courseId, lessonId);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  },
);

const emptyEntry = {
  status: 'idle',
  details: null,
  source: null,
  savedAt: null,
  error: null,
  completionError: null,
  pendingLessonIds: [],
};

const entryFor = (state, courseId) =>
  (state.byId[courseId] ??= { ...emptyEntry });

const setLessonCompleted = (entry, lessonId, completed) => {
  const lesson = entry.details?.lessons.find(item => item.id === lessonId);
  if (lesson) {
    lesson.completed = completed;
  }
};

const courseDetailsSlice = createSlice({
  name: 'courseDetails',
  initialState: { byId: {} },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadCourseDetails.pending, (state, { meta }) => {
        const entry = entryFor(state, meta.arg);
        entry.status = entry.details ? 'success' : 'loading';
        entry.error = null;
      })
      .addCase(loadCourseDetails.fulfilled, (state, { meta, payload }) => {
        const entry = entryFor(state, meta.arg);
        entry.status = 'success';
        entry.details = payload.details;
        entry.source = payload.source;
        entry.savedAt = payload.savedAt;
        entry.error = payload.error;
      })
      .addCase(
        loadCourseDetails.rejected,
        (state, { meta, payload, error }) => {
          const entry = entryFor(state, meta.arg);
          entry.status = entry.details ? 'success' : 'error';
          entry.error = payload ?? serializeError(error);
        },
      )
      .addCase(completeLesson.pending, (state, { meta }) => {
        const { courseId, lessonId } = meta.arg;
        const entry = entryFor(state, courseId);
        entry.pendingLessonIds.push(lessonId);
        entry.completionError = null;
        if (entry.details) {
          entry.details.lessons = markLessonCompleted(
            entry.details.lessons,
            lessonId,
          );
        }
      })
      .addCase(completeLesson.fulfilled, (state, { meta }) => {
        const entry = entryFor(state, meta.arg.courseId);
        entry.pendingLessonIds = entry.pendingLessonIds.filter(
          id => id !== meta.arg.lessonId,
        );
      })
      .addCase(completeLesson.rejected, (state, { meta, payload, error }) => {
        const { courseId, lessonId } = meta.arg;
        const entry = entryFor(state, courseId);
        entry.pendingLessonIds = entry.pendingLessonIds.filter(
          id => id !== lessonId,
        );
        setLessonCompleted(entry, lessonId, false);
        entry.completionError = payload ?? serializeError(error);
      })
      .addCase(logout.fulfilled, () => ({ byId: {} }));
  },
});

export const selectCourseDetailsEntry = (state, courseId) =>
  state.courseDetails.byId[courseId] ?? emptyEntry;

export default courseDetailsSlice.reducer;
