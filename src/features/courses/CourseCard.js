import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { FadeInView, staggerDelay, usePressScale } from '../../ui/animations';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import {
  accentFor,
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from '../../ui/theme';

const initialsOf = title =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');

const ctaFor = progress =>
  progress >= 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start';

export const CourseCard = memo(function CourseCard({
  course,
  index = 0,
  onOpen,
}) {
  const open = () => onOpen(course);
  const accent = accentFor(course.id);
  const { scale, onPressIn, onPressOut } = usePressScale({ to: 0.98 });
  const delay = staggerDelay(index, 120);
  const isDone = course.progress >= 100;

  return (
    <FadeInView delay={delay} offset={18}>
      <Pressable
        onPress={open}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`${course.title}, ${course.progress}% complete`}
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <View style={styles.header}>
            <View style={[styles.tile, { backgroundColor: accent.soft }]}>
              <Text style={[styles.tileText, { color: accent.tint }]}>
                {initialsOf(course.title)}
              </Text>
            </View>
            <View style={styles.heading}>
              <Text style={styles.title} numberOfLines={2}>
                {course.title}
              </Text>
              <Text style={styles.instructor} numberOfLines={1}>
                {course.instructor}
              </Text>
            </View>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressCaption}>
                {isDone ? 'Completed' : 'Progress'}
              </Text>
              <Text style={[styles.progressValue, { color: accent.tint }]}>
                {course.progress}%
              </Text>
            </View>
            <ProgressBar
              value={course.progress}
              color={isDone ? colors.success : accent.tint}
              delay={delay + 120}
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.metaPill}>
              <Text style={styles.meta}>{course.lessonCount} lessons</Text>
            </View>
            <Button
              title={ctaFor(course.progress)}
              size="sm"
              variant="secondary"
              onPress={open}
            />
          </View>
        </Animated.View>
      </Pressable>
    </FadeInView>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg + 4,
    padding: spacing.lg + 4,
    gap: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md + 2 },
  tile: {
    width: 48,
    height: 48,
    borderRadius: radius.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: { fontSize: 17, fontWeight: '800', letterSpacing: 0.4 },
  heading: { flex: 1, gap: spacing.xxs },
  title: { ...typography.headline, color: colors.text },
  instructor: {
    ...typography.caption,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  progressBlock: { gap: spacing.sm },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  progressCaption: { ...typography.overline, color: colors.textTertiary },
  progressValue: { ...typography.label, fontVariant: ['tabular-nums'] },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  meta: { ...typography.caption, color: colors.textSecondary },
});
