import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
  FadeInView,
  staggerDelay,
  useAnimatedValue,
} from '../../ui/animations';
import { Button } from '../../ui/Button';
import {
  colors,
  motion,
  radius,
  shadows,
  spacing,
  typography,
} from '../../ui/theme';

export const LessonRow = memo(function LessonRow({
  lesson,
  index,
  isLast,
  isPending,
  onComplete,
}) {
  const done = useAnimatedValue(lesson.completed ? 1 : 0);
  const pop = useAnimatedValue(1);
  const wasCompleted = useRef(lesson.completed);

  useEffect(() => {
    const changed = wasCompleted.current !== lesson.completed;
    wasCompleted.current = lesson.completed;
    if (!lesson.completed) {
      done.setValue(0);
      return;
    }
    if (!changed) {
      return;
    }
    Animated.parallel([
      Animated.timing(done, {
        toValue: 1,
        duration: motion.base,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(pop, {
          toValue: 1.25,
          duration: 120,
          useNativeDriver: false,
        }),
        Animated.spring(pop, {
          toValue: 1,
          damping: 8,
          stiffness: 220,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [lesson.completed, done, pop]);

  const circleBackground = done.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface, colors.success],
  });
  const circleBorder = done.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.success],
  });

  return (
    <FadeInView delay={staggerDelay(index, 180)} offset={14}>
      <View style={styles.row}>
        <View style={styles.rail}>
          <Animated.View
            style={[
              styles.circle,
              {
                backgroundColor: circleBackground,
                borderColor: circleBorder,
                transform: [{ scale: pop }],
              },
            ]}
          >
            {lesson.completed ? (
              <Text style={styles.check}>✓</Text>
            ) : (
              <Text style={styles.number}>{index + 1}</Text>
            )}
          </Animated.View>
          {isLast ? null : (
            <View
              style={[
                styles.connector,
                lesson.completed && styles.connectorDone,
              ]}
            />
          )}
        </View>

        <View style={[styles.card, lesson.completed && styles.cardDone]}>
          <View style={styles.info}>
            <Text
              style={[styles.title, lesson.completed && styles.titleDone]}
              numberOfLines={2}
            >
              {lesson.title}
            </Text>
            <View
              style={[
                styles.status,
                lesson.completed ? styles.statusDone : styles.statusPending,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  lesson.completed
                    ? styles.statusTextDone
                    : styles.statusTextPending,
                ]}
              >
                {lesson.completed ? 'Completed' : `Lesson ${index + 1}`}
              </Text>
            </View>
          </View>
          {lesson.completed ? null : (
            <Button
              title="Mark done"
              size="sm"
              variant="outline"
              loading={isPending}
              onPress={() => onComplete(lesson.id)}
              style={styles.action}
            />
          )}
        </View>
      </View>
    </FadeInView>
  );
});

const CIRCLE = 32;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg },
  rail: { width: CIRCLE, alignItems: 'center', paddingTop: spacing.lg + 2 },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  check: { fontSize: 15, fontWeight: '800', color: colors.onPrimary },
  connector: {
    flex: 1,
    width: 2,
    marginTop: spacing.xs,
    marginBottom: -spacing.lg,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  connectorDone: { backgroundColor: colors.success, opacity: 0.4 },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardDone: { backgroundColor: colors.surfaceMuted },
  info: { flex: 1, gap: spacing.sm, alignItems: 'flex-start' },
  title: { ...typography.body, fontWeight: '600', color: colors.text },
  titleDone: { color: colors.textSecondary },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
  },
  statusDone: { backgroundColor: colors.successSoft },
  statusPending: { backgroundColor: colors.track },
  statusText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusTextDone: { color: colors.success },
  statusTextPending: { color: colors.textSecondary },
  action: { minWidth: 96 },
});
