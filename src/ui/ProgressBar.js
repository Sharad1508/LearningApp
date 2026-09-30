import { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { easeOut, useAnimatedValue } from './animations';
import { colors, motion } from './theme';

export function ProgressBar({
  value,
  color = colors.primary,
  trackColor = colors.track,
  height = 8,
  delay = 0,
}) {
  const clamped = Math.min(100, Math.max(0, value || 0));
  const width = useAnimatedValue(0);

  useEffect(() => {
    const animation = Animated.timing(width, {
      toValue: clamped,
      duration: motion.slow + 380,
      delay,
      easing: easeOut,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [width, clamped, delay]);

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: trackColor },
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            borderRadius: height / 2,
            backgroundColor: color,
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
