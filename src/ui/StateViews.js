import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors, spacing } from './theme';

export function LoadingView({ message }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Couldn't load data</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button title="Try again" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyView({ title, message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? (
        <Button title="Refresh" variant="secondary" onPress={onRetry} />
      ) : null}
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
    gap: spacing.md,
  },
  title: { fontSize: 18, fontWeight: '600', color: colors.text },
  message: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
});
