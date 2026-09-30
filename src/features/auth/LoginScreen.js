import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../ui/Button';
import { colors, spacing } from '../../ui/theme';
import { useLoginViewModel } from './useLoginViewModel';

export function LoginScreen() {
  const vm = useLoginViewModel();
  const passwordRef = useRef(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Learning Dashboard</Text>
          <Text style={styles.subtitle}>Log in to continue learning</Text>

          <Field
            label="Email"
            value={vm.email}
            onChangeText={vm.onEmailChange}
            error={vm.fieldErrors.email}
            editable={!vm.isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            testID="login-email"
          />
          <Field
            ref={passwordRef}
            label="Password"
            value={vm.password}
            onChangeText={vm.onPasswordChange}
            error={vm.fieldErrors.password}
            editable={!vm.isLoading}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={vm.submit}
            testID="login-password"
          />

          {vm.errorMessage ? (
            <Text style={styles.formError} accessibilityRole="alert">
              {vm.errorMessage}
            </Text>
          ) : null}

          <Button
            title="Log in"
            onPress={vm.submit}
            loading={vm.isLoading}
            testID="login-submit"
          />
          <Text style={styles.hint}>
            Any valid email and a 6+ character password work. Use fail@test.com
            to see the error state.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, error, ref, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={label}
        {...inputProps}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  field: { gap: spacing.xs },
  label: { fontSize: 14, fontWeight: '500', color: colors.text },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  inputError: { borderColor: colors.danger },
  fieldError: { fontSize: 13, color: colors.danger },
  formError: { fontSize: 14, color: colors.danger, textAlign: 'center' },
  hint: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
});
