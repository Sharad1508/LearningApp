import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from './theme';

const formatTime = timestamp =>
  new Date(timestamp).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export function OfflineBanner({ isOffline, savedAt }) {
  const reason = isOffline ? "You're offline." : "Couldn't refresh.";
  const saved = savedAt ? ` Showing data saved ${formatTime(savedAt)}.` : '';
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>
        {reason}
        {saved}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warningBackground,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  text: { color: colors.warningText, fontSize: 13 },
});
