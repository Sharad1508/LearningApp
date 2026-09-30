import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { colors, spacing } from '../../ui/theme';

export const CourseCard = memo(function CourseCard({ course, onOpen }) {
  const open = () => onOpen(course);
  return (
    <Pressable
      style={styles.card}
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`${course.title}, ${course.progress}% complete`}
    >
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.instructor}>{course.instructor}</Text>
      <View style={styles.progressRow}>
        <View style={styles.progressBar}>
          <ProgressBar value={course.progress} />
        </View>
        <Text style={styles.progressText}>{course.progress}%</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.meta}>{course.lessonCount} lessons</Text>
        <Button title="Continue" onPress={open} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  title: { fontSize: 17, fontWeight: '600', color: colors.text },
  instructor: { fontSize: 14, color: colors.textSecondary },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progressBar: { flex: 1 },
  progressText: { fontSize: 13, fontWeight: '600', color: colors.text },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  meta: { fontSize: 13, color: colors.textSecondary },
});
