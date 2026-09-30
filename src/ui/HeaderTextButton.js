import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from './theme';

export function HeaderTextButton({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={spacing.sm}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.primary, fontSize: 16, fontWeight: '500' },
});
