import { AppError, ErrorType } from '../errors';

export function createHttpClient({
  baseUrl,
  timeoutMs,
  getToken = async () => null,
  fetchImpl = fetch,
}) {
  async function request(method, path, body) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const token = await getToken();
    let response;
    try {
      response = await fetchImpl(`${baseUrl}${path}`, {
        method,
        headers: {
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      const type = controller.signal.aborted
        ? ErrorType.TIMEOUT
        : ErrorType.NETWORK;
      throw new AppError(type, undefined, { cause: error });
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 401) {
      throw new AppError(ErrorType.UNAUTHORIZED, undefined, { status: 401 });
    }
    if (!response.ok) {
      throw new AppError(ErrorType.SERVER, undefined, {
        status: response.status,
      });
    }
    try {
      return await response.json();
    } catch (error) {
      throw new AppError(ErrorType.PARSE, undefined, { cause: error });
    }
  }

  return {
    get: path => request('GET', path),
    post: (path, body) => request('POST', path, body),
  };
}
