import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import coursesReducer from '../features/courses/coursesSlice';
import courseDetailsReducer from '../features/courseDetails/courseDetailsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
  courseDetails: courseDetailsReducer,
});

export function createStore({ dependencies, preloadedState } = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ thunk: { extraArgument: dependencies } }),
  });
}
