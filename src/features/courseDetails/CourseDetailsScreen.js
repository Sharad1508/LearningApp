import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FadeInView } from '../../ui/animations';
import { OfflineBanner } from '../../ui/OfflineBanner';
import { ProgressBar } from '../../ui/ProgressBar';
import { ErrorView, SkeletonBlock, SkeletonList } from '../../ui/StateViews';
import {
  accentFor,
  colors,
  motion,
  radius,
  shadows,
  spacing,
  typography,
} from '../../ui/theme';
import { LessonRow } from './LessonRow';
import { useCourseDetailsViewModel } from './useCourseDetailsViewModel';

export function CourseDetailsScreen({ route }) {
  const { courseId } = route.params;
  const vm = useCourseDetailsViewModel(courseId);
  const { pendingLessonIds, completeLesson, lessons } = vm;

  const renderItem = useCallback(
    ({ item, index }) => (
      <LessonRow
        lesson={item}
        index={index}
        isLast={index === lessons.length - 1}
        isPending={pendingLessonIds.includes(item.id)}
        onComplete={completeLesson}
      />
    ),
    [pendingLessonIds, completeLesson, lessons.length],
  );

  if (vm.viewState === 'loading') {
    return <DetailsSkeleton />;
  }
  if (vm.viewState === 'error') {
    return <ErrorView message={vm.errorMessage} onRetry={vm.retry} />;
  }

  const accent = accentFor(courseId);
  const isDone = vm.progress >= 100;
  const remaining = vm.lessons.length - vm.completedCount;

  return (
    <View style={styles.container}>
      {vm.isShowingCachedData ? (
        <OfflineBanner isOffline={vm.isOffline} savedAt={vm.savedAt} />
      ) : null}
      <FlatList
        data={vm.lessons}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <FadeInView>
              <View style={styles.hero}>
                <View style={styles.heroTop}>
                  <View style={styles.heroText}>
                    <Text style={styles.title}>{vm.title}</Text>
                    {vm.instructor ? (
                      <Text style={styles.instructor}>
                        with {vm.instructor}
                      </Text>
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.percentBadge,
                      {
                        backgroundColor: isDone
                          ? colors.successSoft
                          : accent.soft,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.percentText,
                        { color: isDone ? colors.success : accent.tint },
                      ]}
                    >
                      {vm.progress}%
                    </Text>
                  </View>
                </View>

                <ProgressBar
                  value={vm.progress}
                  height={10}
                  color={isDone ? colors.success : accent.tint}
                  delay={motion.fast}
                />

                <View style={styles.metrics}>
                  <Metric value={vm.completedCount} label="Completed" />
                  <Metric value={remaining} label="Remaining" />
                  <Metric value={vm.lessons.length} label="Total" />
                </View>

                {isDone ? (
                  <View style={styles.celebrate}>
                    <Text style={styles.celebrateText}>
                      Course complete. Nice work!
                    </Text>
                  </View>
                ) : null}
              </View>
            </FadeInView>

            {vm.completionErrorMessage ? (
              <FadeInView offset={-6} duration={motion.base}>
                <View style={styles.error} accessibilityRole="alert">
                  <Text style={styles.errorText}>
                    {vm.completionErrorMessage}
                  </Text>
                </View>
              </FadeInView>
            ) : null}

            <Text style={styles.sectionTitle}>Lessons</Text>
          </View>
        }
      />
    </View>
  );
}

function Metric({ value, label }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function DetailsSkeleton() {
  return (
    <SkeletonList
      count={4}
      header={
        <SkeletonBlock
          height={190}
          rounded={radius.xl}
          style={styles.skeletonHero}
        />
      }
      renderItem={() => (
        <View style={styles.skeletonRow}>
          <SkeletonBlock width={32} height={32} rounded={16} />
          <View style={styles.skeletonCard}>
            <SkeletonBlock height={72} rounded={radius.lg} />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingBottom: spacing.xxl },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.md,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  heroText: { flex: 1, gap: spacing.xs },
  title: { ...typography.title, color: colors.text },
  instructor: { ...typography.body, color: colors.textSecondary },
  percentBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  percentText: {
    ...typography.label,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  metricValue: {
    ...typography.headline,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  metricLabel: { ...typography.caption, color: colors.textTertiary },
  celebrate: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
  },
  celebrateText: { ...typography.label, color: colors.success },
  error: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  sectionTitle: { ...typography.overline, color: colors.textTertiary },
  skeletonHero: { marginBottom: spacing.md },
  skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  skeletonCard: { flex: 1 },
});
