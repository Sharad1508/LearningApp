import { createStore } from '../src/app/store';
import { AppError, ErrorType } from '../src/core/errors';
import { DataSource } from '../src/data/repositories/CourseRepository';
import {
  completeLesson,
  loadCourseDetails,
} from '../src/features/courseDetails/courseDetailsSlice';
import { loadCourses } from '../src/features/courses/coursesSlice';

const COURSE = {
  id: '1',
  title: 'Python',
  instructor: 'John',
  progress: 50,
  lessonCount: 2,
};

function setup(overrides = {}) {
  const courseRepository = {
    getCachedCourses: jest.fn().mockResolvedValue(null),
    getCourses: jest.fn().mockResolvedValue({
      courses: [COURSE],
      source: DataSource.REMOTE,
      savedAt: 1,
      error: null,
    }),
    getCourseDetails: jest.fn().mockResolvedValue({
      details: {
        id: '1',
        title: 'Python',
        lessons: [
          { id: '101', title: 'Intro', completed: true },
          { id: '102', title: 'Variables', completed: false },
        ],
      },
      source: DataSource.REMOTE,
      savedAt: 1,
      error: null,
    }),
    completeLesson: jest
      .fn()
      .mockResolvedValue({ courseId: '1', lessonId: '102', progress: 100 }),
    clear: jest.fn(),
    ...overrides,
  };
  const authRepository = { logout: jest.fn(), restoreSession: jest.fn() };
  const store = createStore({
    dependencies: { courseRepository, authRepository },
  });
  return { store, courseRepository };
}

describe('courses state', () => {
  it('goes from loading to success with the fetched courses', async () => {
    const { store } = setup();
    const pending = store.dispatch(loadCourses());
    expect(store.getState().courses.status).toBe('loading');

    await pending;
    expect(store.getState().courses).toMatchObject({
      status: 'success',
      items: [COURSE],
      source: DataSource.REMOTE,
    });
  });

  it('exposes a serializable error when the first load fails', async () => {
    const { store } = setup({
      getCourses: jest.fn().mockRejectedValue(new AppError(ErrorType.NETWORK)),
    });
    await store.dispatch(loadCourses());

    const { status, error } = store.getState().courses;
    expect(status).toBe('error');
    expect(error).toEqual({
      type: ErrorType.NETWORK,
      message: expect.any(String),
    });
  });

  it('updates lesson status and dashboard progress when a lesson is completed', async () => {
    const { store } = setup();
    await store.dispatch(loadCourses());
    await store.dispatch(loadCourseDetails('1'));

    const pending = store.dispatch(
      completeLesson({ courseId: '1', lessonId: '102' }),
    );
    const optimistic = store.getState().courseDetails.byId['1'];
    expect(optimistic.details.lessons[1].completed).toBe(true);
    expect(optimistic.pendingLessonIds).toEqual(['102']);

    await pending;
    expect(store.getState().courses.items[0].progress).toBe(100);
    expect(store.getState().courseDetails.byId['1'].pendingLessonIds).toEqual(
      [],
    );
  });

  it('rolls back the optimistic update if saving the completion fails', async () => {
    const { store } = setup({
      completeLesson: jest.fn().mockRejectedValue(new Error('disk full')),
    });
    await store.dispatch(loadCourseDetails('1'));
    await store.dispatch(completeLesson({ courseId: '1', lessonId: '102' }));

    const entry = store.getState().courseDetails.byId['1'];
    expect(entry.details.lessons[1].completed).toBe(false);
    expect(entry.completionError.type).toBe(ErrorType.UNKNOWN);
  });
});
