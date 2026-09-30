import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { usePressScale } from './animations';
import { colors, radius, spacing, typography } from './theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HeaderTextButton({ title, onPress }) {
  const { scale, onPressIn, onPressOut } = usePressScale({ to: 0.92 });
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      hitSlop={spacing.sm}
      style={[styles.pill, { transform: [{ scale }] }]}
    >
      <Text style={styles.label}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  label: { ...typography.caption, fontWeight: '600', color: colors.primary },
});
