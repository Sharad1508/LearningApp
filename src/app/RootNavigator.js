import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import {
  AuthStatus,
  restoreSession,
  selectAuth,
} from '../features/auth/authSlice';
import { LoginScreen } from '../features/auth/LoginScreen';
import { LogoutButton } from '../features/auth/LogoutButton';
import { CourseDetailsScreen } from '../features/courseDetails/CourseDetailsScreen';
import { DashboardScreen } from '../features/courses/DashboardScreen';
import { LoadingView } from '../ui/StateViews';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const dispatch = useDispatch();
  const { status, user } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (status === AuthStatus.RESTORING) {
    return <LoadingView />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: 'My Courses', headerRight: LogoutButton }}
          />
          <Stack.Screen
            name="CourseDetails"
            component={CourseDetailsScreen}
            options={({ route }) => ({ title: route.params.title })}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
