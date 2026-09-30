import { AppError, ErrorType } from '../src/core/errors';
import { createKeyValueStore } from '../src/core/storage/keyValueStore';
import { createCourseLocalDataSource } from '../src/data/local/courseLocalDataSource';
import {
  DataSource,
  createCourseRepository,
} from '../src/data/repositories/CourseRepository';

const COURSES = [
  {
    id: '1',
    title: 'Python',
    instructor: 'John',
    progress: 50,
    lessonCount: 2,
  },
];
const DETAILS = {
  id: '1',
  title: 'Python',
  instructor: 'John',
  lessons: [
    { id: '101', title: 'Intro', completed: true },
    { id: '102', title: 'Variables', completed: false },
  ],
};

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: async key => map.get(key) ?? null,
    setItem: async (key, value) => {
      map.set(key, value);
    },
    removeItem: async key => {
      map.delete(key);
    },
  };
}

function setup() {
  const api = {
    fetchCourses: jest.fn().mockResolvedValue(COURSES),
    fetchCourseDetails: jest.fn().mockResolvedValue(DETAILS),
  };
  const local = createCourseLocalDataSource(
    createKeyValueStore(createMemoryStorage()),
    () => 1000,
  );
  const repository = createCourseRepository({ api, local, now: () => 2000 });
  return { api, repository };
}

const offline = () => new AppError(ErrorType.NETWORK);

describe('CourseRepository', () => {
  it('serves the last saved courses when the network is down', async () => {
    const { api, repository } = setup();
    await repository.getCourses();

    api.fetchCourses.mockRejectedValue(offline());
    const result = await repository.getCourses();

    expect(result.source).toBe(DataSource.CACHE);
    expect(result.courses).toEqual(COURSES);
    expect(result.savedAt).toBe(1000);
    expect(result.error.type).toBe(ErrorType.NETWORK);
  });

  it('throws when offline and nothing has been cached yet', async () => {
    const { api, repository } = setup();
    api.fetchCourses.mockRejectedValue(offline());

    await expect(repository.getCourses()).rejects.toMatchObject({
      type: ErrorType.NETWORK,
    });
  });

  it('does not hide an expired session behind cached data', async () => {
    const { api, repository } = setup();
    await repository.getCourses();

    api.fetchCourses.mockRejectedValue(new AppError(ErrorType.UNAUTHORIZED));
    await expect(repository.getCourses()).rejects.toMatchObject({
      type: ErrorType.UNAUTHORIZED,
    });
  });

  it('keeps a lesson completed offline and reflects it in course progress', async () => {
    const { api, repository } = setup();
    await repository.getCourses();
    await repository.getCourseDetails('1');

    const completion = await repository.completeLesson('1', '102');
    expect(completion.progress).toBe(100);

    api.fetchCourses.mockRejectedValue(offline());
    api.fetchCourseDetails.mockRejectedValue(offline());

    const { details, source } = await repository.getCourseDetails('1');
    expect(source).toBe(DataSource.CACHE);
    expect(details.lessons.every(lesson => lesson.completed)).toBe(true);

    const { courses } = await repository.getCourses();
    expect(courses[0].progress).toBe(100);
  });

  it('merges local completions over fresh server data', async () => {
    const { repository } = setup();
    await repository.getCourseDetails('1');
    await repository.completeLesson('1', '102');

    const { details, source } = await repository.getCourseDetails('1');
    expect(source).toBe(DataSource.REMOTE);
    expect(details.lessons[1].completed).toBe(true);
  });
});
