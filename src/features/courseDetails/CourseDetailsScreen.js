import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../ui/OfflineBanner';
import { ProgressBar } from '../../ui/ProgressBar';
import { ErrorView, LoadingView } from '../../ui/StateViews';
import { colors, spacing } from '../../ui/theme';
import { LessonRow } from './LessonRow';
import { useCourseDetailsViewModel } from './useCourseDetailsViewModel';

export function CourseDetailsScreen({ route }) {
  const vm = useCourseDetailsViewModel(route.params.courseId);
  const { pendingLessonIds, completeLesson } = vm;

  const renderItem = useCallback(
    ({ item, index }) => (
      <LessonRow
        lesson={item}
        index={index}
        isPending={pendingLessonIds.includes(item.id)}
        onComplete={completeLesson}
      />
    ),
    [pendingLessonIds, completeLesson],
  );

  if (vm.viewState === 'loading') {
    return <LoadingView message="Loading lessons…" />;
  }
  if (vm.viewState === 'error') {
    return <ErrorView message={vm.errorMessage} onRetry={vm.retry} />;
  }

  return (
    <View style={styles.container}>
      {vm.isShowingCachedData ? (
        <OfflineBanner isOffline={vm.isOffline} savedAt={vm.savedAt} />
      ) : null}
      <FlatList
        data={vm.lessons}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{vm.title}</Text>
            {vm.instructor ? (
              <Text style={styles.instructor}>{vm.instructor}</Text>
            ) : null}
            <ProgressBar value={vm.progress} />
            <Text style={styles.progressText}>
              {vm.progress}% complete · {vm.completedCount} of{' '}
              {vm.lessons.length} lessons
            </Text>
            {vm.completionErrorMessage ? (
              <Text style={styles.error} accessibilityRole="alert">
                {vm.completionErrorMessage}
              </Text>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, gap: spacing.sm },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  instructor: { fontSize: 14, color: colors.textSecondary },
  progressText: { fontSize: 14, color: colors.text },
  error: { fontSize: 13, color: colors.danger },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
