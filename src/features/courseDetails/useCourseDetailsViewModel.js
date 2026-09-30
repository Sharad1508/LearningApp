import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsOnline } from '../../core/network/connectivity';
import { DataSource } from '../../data/repositories/CourseRepository';
import { calculateProgress } from '../../domain/progress';
import { selectCourseById } from '../courses/coursesSlice';
import {
  completeLesson,
  loadCourseDetails,
  selectCourseDetailsEntry,
} from './courseDetailsSlice';

export function useCourseDetailsViewModel(courseId) {
  const dispatch = useDispatch();
  const entry = useSelector(state => selectCourseDetailsEntry(state, courseId));
  const summary = useSelector(state => selectCourseById(state, courseId));
  const isOnline = useIsOnline();

  const load = useCallback(
    () => dispatch(loadCourseDetails(courseId)),
    [dispatch, courseId],
  );

  useEffect(() => {
    load();
  }, [load]);

  const lessons = useMemo(() => entry.details?.lessons ?? [], [entry.details]);
  const completedCount = lessons.filter(lesson => lesson.completed).length;

  const viewState =
    entry.status === 'success'
      ? 'content'
      : entry.status === 'error'
      ? 'error'
      : 'loading';

  return {
    viewState,
    title: entry.details?.title ?? summary?.title ?? '',
    instructor: entry.details?.instructor ?? summary?.instructor,
    lessons,
    progress: calculateProgress(lessons),
    completedCount,
    pendingLessonIds: entry.pendingLessonIds,
    errorMessage: entry.error?.message,
    completionErrorMessage: entry.completionError?.message,
    isShowingCachedData: entry.source === DataSource.CACHE,
    isOffline: !isOnline,
    savedAt: entry.savedAt,
    retry: load,
    completeLesson: useCallback(
      lessonId => dispatch(completeLesson({ courseId, lessonId })),
      [dispatch, courseId],
    ),
  };
}
