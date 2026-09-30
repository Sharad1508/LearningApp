import { useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FadeInView, useAnimatedValue } from './animations';
import { Button } from './Button';
import { colors, shadows, spacing, typography } from './theme';

export function LoadingView({ message }) {
  return (
    <View style={styles.container}>
      <FadeInView style={styles.center}>
        <View style={styles.spinnerHalo}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </FadeInView>
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <FadeInView style={styles.center}>
        <Badge glyph="!" tint={colors.danger} soft={colors.dangerSoft} />
        <Text style={styles.title}>Couldn't load data</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {onRetry ? (
          <Button title="Try again" onPress={onRetry} style={styles.action} />
        ) : null}
      </FadeInView>
    </View>
  );
}

export function EmptyView({ title, message, onRetry }) {
  return (
    <View style={styles.container}>
      <FadeInView style={styles.center}>
        <Badge glyph="✦" tint={colors.primary} soft={colors.primarySoft} />
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {onRetry ? (
          <Button
            title="Refresh"
            variant="secondary"
            onPress={onRetry}
            style={styles.action}
          />
        ) : null}
      </FadeInView>
    </View>
  );
}

function Badge({ glyph, tint, soft }) {
  const pop = useAnimatedValue(0.6);
  useEffect(() => {
    Animated.spring(pop, {
      toValue: 1,
      damping: 9,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  }, [pop]);
  return (
    <Animated.View
      style={[
        styles.badgeOuter,
        { backgroundColor: soft, transform: [{ scale: pop }] },
      ]}
    >
      <View style={[styles.badgeInner, { backgroundColor: tint }]}>
        <Text style={styles.badgeGlyph}>{glyph}</Text>
      </View>
    </Animated.View>
  );
}

export function useShimmer() {
  const value = useAnimatedValue(0.55);
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0.55,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value]);
  return value;
}

export function SkeletonBlock({
  width = '100%',
  height = 12,
  rounded = 6,
  style,
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: rounded,
          backgroundColor: colors.skeleton,
        },
        style,
      ]}
    />
  );
}

export function SkeletonList({ count = 3, header, renderItem }) {
  const opacity = useShimmer();
  return (
    <View style={styles.skeletonScreen} accessibilityLabel="Loading" accessible>
      <Animated.View style={[styles.skeletonContent, { opacity }]}>
        {header}
        {Array.from({ length: count }, (_, index) => (
          <View key={index}>{renderItem(index)}</View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  center: { alignItems: 'center', gap: spacing.md, maxWidth: 320 },
  spinnerHalo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  badgeOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGlyph: { fontSize: 24, fontWeight: '800', color: colors.onPrimary },
  title: { ...typography.title, color: colors.text, textAlign: 'center' },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: { marginTop: spacing.md, minWidth: 180 },
  skeletonScreen: { flex: 1, backgroundColor: colors.background },
  skeletonContent: { padding: spacing.lg, gap: spacing.md },
});
