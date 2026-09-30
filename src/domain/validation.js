const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;

export function validateEmail(email) {
  const value = email.trim();
  if (!value) {
    return 'Email is required';
  }
  if (!EMAIL_PATTERN.test(value)) {
    return 'Enter a valid email address';
  }
  return null;
}

export function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

export function validateCredentials({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) {
    errors.email = emailError;
  }
  if (passwordError) {
    errors.password = passwordError;
  }
  return errors;
}
