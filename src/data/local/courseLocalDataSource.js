const KEYS = {
  courses: 'courses:list',
  details: 'courses:details',
  completions: 'courses:completions',
};

export function createCourseLocalDataSource(store, now = Date.now) {
  // Serializes read-modify-write updates so rapid taps can't overwrite each other.
  let writeQueue = Promise.resolve();
  const enqueue = task => {
    const result = writeQueue.then(task);
    writeQueue = result.catch(() => {});
    return result;
  };

  const getDetailsMap = async () => (await store.getJSON(KEYS.details)) ?? {};
  const getCompletions = async () =>
    (await store.getJSON(KEYS.completions)) ?? {};

  return {
    getCourses: () => store.getJSON(KEYS.courses),
    saveCourses: courses =>
      store.setJSON(KEYS.courses, { items: courses, savedAt: now() }),

    getDetailsMap,
    getCourseDetails: async courseId =>
      (await getDetailsMap())[courseId] ?? null,
    saveCourseDetails: details =>
      enqueue(async () => {
        const map = await getDetailsMap();
        map[details.id] = { item: details, savedAt: now() };
        await store.setJSON(KEYS.details, map);
      }),

    getCompletions,
    addCompletion: (courseId, lessonId) =>
      enqueue(async () => {
        const completions = await getCompletions();
        const ids = new Set(completions[courseId] ?? []);
        ids.add(lessonId);
        completions[courseId] = [...ids];
        await store.setJSON(KEYS.completions, completions);
        return completions[courseId];
      }),

    clear: () =>
      enqueue(() => Promise.all(Object.values(KEYS).map(store.remove))),
  };
}
