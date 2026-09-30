import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { usePressScale } from './animations';
import { colors, radius, shadows, spacing, typography } from './theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const VARIANTS = {
  primary: {
    container: { backgroundColor: colors.primary, ...shadows.primary },
    label: { color: colors.onPrimary },
    spinner: colors.onPrimary,
  },
  secondary: {
    container: { backgroundColor: colors.primarySoft },
    label: { color: colors.primary },
    spinner: colors.primary,
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.primaryMuted,
    },
    label: { color: colors.primary },
    spinner: colors.primary,
  },
};

const SIZES = {
  md: {
    container: { minHeight: 52, paddingHorizontal: spacing.xl },
    label: { fontSize: 16 },
  },
  sm: {
    container: { minHeight: 36, paddingHorizontal: spacing.md },
    label: { fontSize: 13 },
  },
};

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  size = 'md',
  style,
  testID,
}) {
  const isDisabled = disabled || loading;
  const look = VARIANTS[variant] ?? VARIANTS.primary;
  const dims = SIZES[size] ?? SIZES.md;
  const { scale, onPressIn, onPressOut } = usePressScale({ to: 0.96 });

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      hitSlop={size === 'sm' ? spacing.xs : 0}
      style={[
        styles.base,
        dims.container,
        look.container,
        isDisabled && !loading && styles.disabled,
        { transform: [{ scale }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={look.spinner} />
      ) : (
        <Text style={[styles.label, dims.label, look.label]} numberOfLines={1}>
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.45 },
  label: { ...typography.label, letterSpacing: 0.1 },
});
