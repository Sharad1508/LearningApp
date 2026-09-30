import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateCredentials } from '../../domain/validation';
import { AuthStatus, authErrorCleared, login, selectAuth } from './authSlice';

export function useLoginViewModel() {
  const dispatch = useDispatch();
  const { status, error } = useSelector(selectAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const clearErrors = useCallback(
    field => {
      setFieldErrors(current =>
        current[field] ? { ...current, [field]: null } : current,
      );
      if (error) {
        dispatch(authErrorCleared());
      }
    },
    [dispatch, error],
  );

  const onEmailChange = useCallback(
    value => {
      setEmail(value);
      clearErrors('email');
    },
    [clearErrors],
  );

  const onPasswordChange = useCallback(
    value => {
      setPassword(value);
      clearErrors('password');
    },
    [clearErrors],
  );

  const submit = useCallback(() => {
    const errors = validateCredentials({ email, password });
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      dispatch(login({ email, password }));
    }
  }, [dispatch, email, password]);

  return {
    email,
    password,
    fieldErrors,
    isLoading: status === AuthStatus.LOADING,
    errorMessage: error?.message ?? null,
    onEmailChange,
    onPasswordChange,
    submit,
  };
}
