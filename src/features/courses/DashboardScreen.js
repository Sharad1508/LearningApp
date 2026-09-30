import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../ui/OfflineBanner';
import { EmptyView, ErrorView, LoadingView } from '../../ui/StateViews';
import { colors, spacing } from '../../ui/theme';
import { CourseCard } from './CourseCard';
import {
  DashboardViewState,
  useDashboardViewModel,
} from './useDashboardViewModel';

export function DashboardScreen({ navigation }) {
  const vm = useDashboardViewModel();
  const openCourse = useCallback(
    course =>
      navigation.navigate('CourseDetails', {
        courseId: course.id,
        title: course.title,
      }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }) => <CourseCard course={item} onOpen={openCourse} />,
    [openCourse],
  );

  switch (vm.viewState) {
    case DashboardViewState.LOADING:
      return <LoadingView message="Loading your courses…" />;
    case DashboardViewState.ERROR:
      return <ErrorView message={vm.errorMessage} onRetry={vm.refresh} />;
    case DashboardViewState.EMPTY:
      return (
        <EmptyView
          title="No courses yet"
          message="Courses you enroll in will show up here."
          onRetry={vm.refresh}
        />
      );
    default:
      return (
        <View style={styles.container}>
          {vm.isShowingCachedData ? (
            <OfflineBanner isOffline={vm.isOffline} savedAt={vm.savedAt} />
          ) : null}
          <FlatList
            data={vm.courses}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              vm.userName ? (
                <Text style={styles.greeting}>Welcome back, {vm.userName}</Text>
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={vm.isRefreshing}
                onRefresh={vm.refresh}
              />
            }
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.md },
  greeting: { fontSize: 16, color: colors.textSecondary },
});
