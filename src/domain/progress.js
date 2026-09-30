export function calculateProgress(lessons) {
  if (!lessons?.length) {
    return 0;
  }
  const completed = lessons.filter(lesson => lesson.completed).length;
  return Math.round((completed / lessons.length) * 100);
}

export function applyCompletions(lessons, completedLessonIds = []) {
  if (!completedLessonIds.length) {
    return lessons;
  }
  const completedIds = new Set(completedLessonIds);
  return lessons.map(lesson =>
    !lesson.completed && completedIds.has(lesson.id)
      ? { ...lesson, completed: true }
      : lesson,
  );
}

export function markLessonCompleted(lessons, lessonId) {
  return applyCompletions(lessons, [lessonId]);
}
