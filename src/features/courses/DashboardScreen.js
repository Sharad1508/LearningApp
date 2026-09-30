import { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { FadeInView } from '../../ui/animations';
import { OfflineBanner } from '../../ui/OfflineBanner';
import { ProgressBar } from '../../ui/ProgressBar';
import {
  EmptyView,
  ErrorView,
  SkeletonBlock,
  SkeletonList,
} from '../../ui/StateViews';
import { colors, radius, shadows, spacing, typography } from '../../ui/theme';
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
    ({ item, index }) => (
      <CourseCard course={item} index={index} onOpen={openCourse} />
    ),
    [openCourse],
  );

  const stats = useMemo(() => {
    const count = vm.courses.length;
    const lessons = vm.courses.reduce((sum, c) => sum + c.lessonCount, 0);
    const average = count
      ? Math.round(vm.courses.reduce((sum, c) => sum + c.progress, 0) / count)
      : 0;
    const completed = vm.courses.filter(c => c.progress >= 100).length;
    return { count, lessons, average, completed };
  }, [vm.courses]);

  switch (vm.viewState) {
    case DashboardViewState.LOADING:
      return <DashboardSkeleton />;
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
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <SummaryHeader userName={vm.userName} stats={stats} />
            }
            refreshControl={
              <RefreshControl
                refreshing={vm.isRefreshing}
                onRefresh={vm.refresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          />
        </View>
      );
  }
}

function SummaryHeader({ userName, stats }) {
  return (
    <View style={styles.headerBlock}>
      <FadeInView>
        {userName ? (
          <Text style={styles.greeting}>
            Welcome back, <Text style={styles.greetingName}>{userName}</Text>
          </Text>
        ) : null}
        <Text style={styles.headline}>Keep the streak going</Text>
      </FadeInView>

      <FadeInView delay={60} offset={16}>
        <View style={styles.hero}>
          <View style={styles.heroOrb} pointerEvents="none" />
          <Text style={styles.heroOverline}>Overall progress</Text>
          <View style={styles.heroValueRow}>
            <Text style={styles.heroValue}>{stats.average}</Text>
            <Text style={styles.heroUnit}>%</Text>
          </View>
          <ProgressBar
            value={stats.average}
            height={6}
            color={colors.onPrimary}
            trackColor="rgba(255,255,255,0.22)"
            delay={200}
          />
          <View style={styles.statsRow}>
            <Stat value={stats.count} label="Courses" />
            <View style={styles.statDivider} />
            <Stat value={stats.lessons} label="Lessons" />
            <View style={styles.statDivider} />
            <Stat value={stats.completed} label="Completed" />
          </View>
        </View>
      </FadeInView>

      <Text style={styles.sectionTitle}>Your courses</Text>
    </View>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DashboardSkeleton() {
  return (
    <SkeletonList
      count={3}
      header={
        <View style={styles.skeletonHeader}>
          <SkeletonBlock width={140} height={14} />
          <SkeletonBlock width={220} height={24} rounded={8} />
          <SkeletonBlock
            height={168}
            rounded={radius.xl}
            style={styles.skeletonHero}
          />
        </View>
      }
      renderItem={() => (
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonRow}>
            <SkeletonBlock width={48} height={48} rounded={radius.md + 2} />
            <View style={styles.skeletonLines}>
              <SkeletonBlock width="70%" height={14} />
              <SkeletonBlock width="45%" height={12} />
            </View>
          </View>
          <SkeletonBlock height={8} rounded={4} />
          <View style={styles.skeletonFooter}>
            <SkeletonBlock width={88} height={26} rounded={radius.pill} />
            <SkeletonBlock width={84} height={36} rounded={radius.pill} />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.md + 2,
  },
  headerBlock: { gap: spacing.lg, marginBottom: spacing.xs },
  greeting: { ...typography.body, color: colors.textSecondary },
  greetingName: { fontWeight: '700', color: colors.text },
  headline: { ...typography.title, color: colors.text, marginTop: spacing.xxs },
  hero: {
    overflow: 'hidden',
    borderRadius: radius.xl,
    padding: spacing.xl,
    backgroundColor: colors.primary,
    gap: spacing.sm,
    ...shadows.primary,
  },
  heroOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -90,
    right: -70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroOverline: { ...typography.overline, color: colors.onPrimaryMuted },
  heroValueRow: { flexDirection: 'row', alignItems: 'flex-start' },
  heroValue: {
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.onPrimary,
    fontVariant: ['tabular-nums'],
  },
  heroUnit: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.onPrimaryMuted,
    marginLeft: spacing.xxs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  stat: { flex: 1, gap: spacing.xxs },
  statValue: {
    ...typography.headline,
    color: colors.onPrimary,
    fontVariant: ['tabular-nums'],
  },
  statLabel: { ...typography.caption, color: colors.onPrimaryMuted },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  skeletonHeader: { gap: spacing.sm, marginBottom: spacing.sm },
  skeletonHero: { marginTop: spacing.md },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg + 4,
    padding: spacing.lg + 4,
    gap: spacing.lg,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md + 2,
  },
  skeletonLines: { flex: 1, gap: spacing.sm },
  skeletonFooter: { flexDirection: 'row', justifyContent: 'space-between' },
});
