import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsOnline } from '../../core/network/connectivity';
import { DataSource } from '../../data/repositories/CourseRepository';
import { selectAuth } from '../auth/authSlice';
import { loadCourses, selectCourses } from './coursesSlice';

export const DashboardViewState = {
  LOADING: 'loading',
  ERROR: 'error',
  EMPTY: 'empty',
  CONTENT: 'content',
};

function toViewState(status, itemCount) {
  if (status === 'error') {
    return DashboardViewState.ERROR;
  }
  if (status === 'success') {
    return itemCount ? DashboardViewState.CONTENT : DashboardViewState.EMPTY;
  }
  return DashboardViewState.LOADING;
}

export function useDashboardViewModel() {
  const dispatch = useDispatch();
  const { items, status, isRefreshing, source, savedAt, error } =
    useSelector(selectCourses);
  const { user } = useSelector(selectAuth);
  const isOnline = useIsOnline();
  const wasOnline = useRef(isOnline);

  const refresh = useCallback(() => dispatch(loadCourses()), [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const cameBackOnline = isOnline && !wasOnline.current;
    wasOnline.current = isOnline;
    if (cameBackOnline && (source === DataSource.CACHE || error)) {
      refresh();
    }
  }, [isOnline, source, error, refresh]);

  return {
    viewState: toViewState(status, items.length),
    courses: items,
    userName: user?.name,
    errorMessage: error?.message,
    isShowingCachedData: source === DataSource.CACHE && !isRefreshing,
    isOffline: !isOnline,
    savedAt,
    isRefreshing,
    refresh,
  };
}
