import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../ui/Button';
import { colors, spacing } from '../../ui/theme';

export const LessonRow = memo(function LessonRow({
  lesson,
  index,
  isPending,
  onComplete,
}) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.title}>
          {index + 1}. {lesson.title}
        </Text>
        <Text style={lesson.completed ? styles.completed : styles.pending}>
          {lesson.completed ? '✓ Completed' : '○ Pending'}
        </Text>
      </View>
      {lesson.completed ? null : (
        <Button
          title="Mark complete"
          variant="secondary"
          loading={isPending}
          onPress={() => onComplete(lesson.id)}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  info: { flex: 1, gap: spacing.xs },
  title: { fontSize: 15, color: colors.text },
  completed: { fontSize: 13, color: colors.success, fontWeight: '500' },
  pending: { fontSize: 13, color: colors.textSecondary },
});
