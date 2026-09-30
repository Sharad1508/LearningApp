import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { motion } from './theme';

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

export function useAnimatedValue(initial) {
  return useRef(new Animated.Value(initial)).current;
}

export function usePressScale({ to = 0.97 } = {}) {
  const scale = useAnimatedValue(1);
  const animate = value =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      ...motion.spring,
    }).start();
  return {
    scale,
    onPressIn: () => animate(to),
    onPressOut: () => animate(1),
  };
}

export function FadeInView({
  delay = 0,
  offset = 12,
  duration = motion.slow,
  style,
  children,
  ...rest
}) {
  const progress = useAnimatedValue(0);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: easeOut,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [offset, 0],
              }),
            },
          ],
        },
      ]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
}

export function staggerDelay(index, base = 0) {
  return base + Math.min(index, 8) * motion.stagger;
}
