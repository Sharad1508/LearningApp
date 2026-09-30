import { ErrorType, toAppError } from '../../core/errors';
import { applyCompletions, calculateProgress } from '../../domain/progress';

export const DataSource = { REMOTE: 'remote', CACHE: 'cache' };

export function createCourseRepository({ api, local, now = Date.now }) {
  async function withLocalProgress(courses) {
    const [detailsMap, completions] = await Promise.all([
      local.getDetailsMap(),
      local.getCompletions(),
    ]);
    return courses.map(course => {
      const cached = detailsMap[course.id]?.item;
      if (!cached) {
        return course;
      }
      const lessons = applyCompletions(cached.lessons, completions[course.id]);
      return { ...course, progress: calculateProgress(lessons) };
    });
  }

  async function withLocalCompletions(details) {
    const completions = await local.getCompletions();
    return {
      ...details,
      lessons: applyCompletions(details.lessons, completions[details.id]),
    };
  }

  // Remote first; on failure fall back to the last saved copy. An expired
  // session is never masked by cached data.
  async function fetchWithFallback({ fetchRemote, saveLocal, readLocal }) {
    try {
      const data = await fetchRemote();
      await saveLocal(data);
      return { data, source: DataSource.REMOTE, savedAt: now(), error: null };
    } catch (rawError) {
      const error = toAppError(rawError);
      const cached =
        error.type === ErrorType.UNAUTHORIZED ? null : await readLocal();
      if (!cached) {
        throw error;
      }
      return {
        data: cached.item,
        source: DataSource.CACHE,
        savedAt: cached.savedAt,
        error,
      };
    }
  }

  return {
    async getCachedCourses() {
      const cached = await local.getCourses();
      if (!cached) {
        return null;
      }
      return {
        courses: await withLocalProgress(cached.items),
        source: DataSource.CACHE,
        savedAt: cached.savedAt,
      };
    },

    async getCourses() {
      const { data, ...meta } = await fetchWithFallback({
        fetchRemote: api.fetchCourses,
        saveLocal: local.saveCourses,
        readLocal: async () => {
          const cached = await local.getCourses();
          return cached && { item: cached.items, savedAt: cached.savedAt };
        },
      });
      return { courses: await withLocalProgress(data), ...meta };
    },

    async getCourseDetails(courseId) {
      const { data, ...meta } = await fetchWithFallback({
        fetchRemote: () => api.fetchCourseDetails(courseId),
        saveLocal: local.saveCourseDetails,
        readLocal: () => local.getCourseDetails(courseId),
      });
      return { details: await withLocalCompletions(data), ...meta };
    },

    // Completions are stored locally and merged over server state; a
    // production build would also queue them for sync to the backend.
    async completeLesson(courseId, lessonId) {
      await local.addCompletion(courseId, lessonId);
      const cached = await local.getCourseDetails(courseId);
      const details = cached && (await withLocalCompletions(cached.item));
      return {
        courseId,
        lessonId,
        progress: details ? calculateProgress(details.lessons) : null,
      };
    },

    clear: () => local.clear(),
  };
}
