export const ErrorType = {
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  SERVER: 'server',
  PARSE: 'parse',
  UNAUTHORIZED: 'unauthorized',
  UNKNOWN: 'unknown',
};

const DEFAULT_MESSAGES = {
  [ErrorType.NETWORK]:
    'No internet connection. Check your network and try again.',
  [ErrorType.TIMEOUT]: 'The request timed out. Please try again.',
  [ErrorType.SERVER]:
    'Something went wrong on our side. Please try again later.',
  [ErrorType.PARSE]: 'We received unexpected data. Please try again later.',
  [ErrorType.UNAUTHORIZED]: 'Your session has expired. Please log in again.',
  [ErrorType.UNKNOWN]: 'Something went wrong. Please try again.',
};

export class AppError extends Error {
  constructor(type, message = DEFAULT_MESSAGES[type], { status, cause } = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.status = status;
    this.cause = cause;
  }
}

export function toAppError(error) {
  if (error instanceof AppError) {
    return error;
  }
  return new AppError(ErrorType.UNKNOWN, undefined, { cause: error });
}

export function serializeError(error) {
  const appError = toAppError(error);
  return { type: appError.type, message: appError.message };
}

export const isConnectivityError = error =>
  error?.type === ErrorType.NETWORK || error?.type === ErrorType.TIMEOUT;
