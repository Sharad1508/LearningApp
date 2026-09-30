import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FadeInView, useAnimatedValue } from '../../ui/animations';
import { Button } from '../../ui/Button';
import {
  colors,
  motion,
  radius,
  shadows,
  spacing,
  typography,
} from '../../ui/theme';
import { useLoginViewModel } from './useLoginViewModel';

export function LoginScreen() {
  const vm = useLoginViewModel();
  const passwordRef = useRef(null);
  const shake = useAnimatedValue(0);

  useEffect(() => {
    if (!vm.errorMessage) {
      return;
    }
    shake.setValue(0);
    Animated.sequence(
      [10, -10, 7, -7, 3, 0].map(toValue =>
        Animated.timing(shake, {
          toValue,
          duration: 50,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [vm.errorMessage, shake]);

  return (
    <View style={styles.root}>
      <View style={styles.backdrop} pointerEvents="none">
        <View style={[styles.orb, styles.orbLarge]} />
        <View style={[styles.orb, styles.orbSmall]} />
      </View>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FadeInView style={styles.hero}>
              <View style={styles.logo}>
                <Text style={styles.logoGlyph}>L</Text>
              </View>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Log in to pick up right where you left off.
              </Text>
            </FadeInView>

            <FadeInView delay={120}>
              <Animated.View
                style={[styles.card, { transform: [{ translateX: shake }] }]}
              >
                <Field
                  label="Email"
                  value={vm.email}
                  onChangeText={vm.onEmailChange}
                  error={vm.fieldErrors.email}
                  editable={!vm.isLoading}
                  placeholder="you@example.com"
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
                  placeholder="At least 6 characters"
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="go"
                  onSubmitEditing={vm.submit}
                  testID="login-password"
                />

                {vm.errorMessage ? (
                  <FadeInView offset={-6} duration={motion.base}>
                    <View style={styles.formError} accessibilityRole="alert">
                      <Text style={styles.formErrorText}>
                        {vm.errorMessage}
                      </Text>
                    </View>
                  </FadeInView>
                ) : null}

                <Button
                  title="Log in"
                  onPress={vm.submit}
                  loading={vm.isLoading}
                  style={styles.submit}
                  testID="login-submit"
                />
              </Animated.View>
            </FadeInView>

            <FadeInView delay={240}>
              <Text style={styles.hint}>
                Any valid email and a 6+ character password work.{'\n'}Use{' '}
                <Text style={styles.hintStrong}>fail@test.com</Text> to see the
                error state.
              </Text>
            </FadeInView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Field({ label, error, ref, onFocus, onBlur, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  const focus = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(focus, {
      toValue: focused ? 1 : 0,
      duration: motion.fast,
      useNativeDriver: false,
    }).start();
  }, [focused, focus]);

  const borderColor = error
    ? colors.danger
    : focus.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
      });
  const backgroundColor = focus.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surfaceMuted, colors.surface],
  });

  return (
    <View style={styles.field}>
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {label}
      </Text>
      <Animated.View
        style={[styles.inputWrap, { borderColor, backgroundColor }]}
      >
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.primary}
          accessibilityLabel={label}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
      </Animated.View>
      {error ? (
        <FadeInView offset={-4} duration={motion.base}>
          <Text style={styles.fieldError}>{error}</Text>
        </FadeInView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  orb: { position: 'absolute', borderRadius: 999 },
  orbLarge: {
    width: 420,
    height: 420,
    top: -220,
    right: -140,
    backgroundColor: colors.primary,
    opacity: 0.12,
  },
  orbSmall: {
    width: 220,
    height: 220,
    top: 80,
    left: -120,
    backgroundColor: '#0EA5A4',
    opacity: 0.08,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.xl,
  },
  hero: { gap: spacing.sm },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.primary,
  },
  logoGlyph: { fontSize: 26, fontWeight: '800', color: colors.onPrimary },
  title: { ...typography.display, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.lg,
  },
  field: { gap: spacing.sm },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelFocused: { color: colors.primary },
  inputWrap: {
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: radius.md,
    justifyContent: 'center',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    fontSize: 16,
  },
  fieldError: { ...typography.caption, color: colors.danger },
  formError: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  formErrorText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  submit: { marginTop: spacing.xs },
  hint: {
    ...typography.caption,
    fontWeight: '400',
    lineHeight: 19,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  hintStrong: { fontWeight: '700', color: colors.textSecondary },
});
