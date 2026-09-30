import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { easeOut, useAnimatedValue } from './animations';
import { colors, motion, radius, spacing, typography } from './theme';

const formatTime = timestamp =>
  new Date(timestamp).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export function OfflineBanner({ isOffline, savedAt }) {
  const enter = useAnimatedValue(0);
  const pulse = useAnimatedValue(1);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: motion.base,
      easing: easeOut,
      useNativeDriver: true,
    }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enter, pulse]);

  const reason = isOffline ? "You're offline" : "Couldn't refresh";
  const saved = savedAt
    ? `Showing data saved ${formatTime(savedAt)}`
    : 'Showing saved data';

  return (
    <Animated.View
      accessibilityRole="alert"
      style={[
        styles.banner,
        {
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [-12, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Animated.View style={[styles.dot, { opacity: pulse }]} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>{reason}</Text>
        <Text style={styles.text}>{saved}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBackground,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
  },
  textBlock: { flex: 1, gap: spacing.xxs },
  title: { ...typography.label, color: colors.warningText },
  text: { ...typography.caption, fontWeight: '400', color: colors.warningText },
});
