import { AppError, ErrorType } from '../../core/errors';

const FIXTURES = {
  '/courses.json': require('../../../mock-api/courses.json'),
  '/courses/1.json': require('../../../mock-api/courses/1.json'),
  '/courses/2.json': require('../../../mock-api/courses/2.json'),
  '/courses/3.json': require('../../../mock-api/courses/3.json'),
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Stands in for a backend: same get(path) contract as httpClient, and it
// fails with a network error when the device is offline.
export function createMockServer({ latencyMs, isOnline, scenario = 'normal' }) {
  async function simulateRequest() {
    await delay(latencyMs);
    if (!(await isOnline())) {
      throw new AppError(ErrorType.NETWORK);
    }
  }

  return {
    async get(path) {
      await simulateRequest();
      if (scenario === 'error') {
        throw new AppError(ErrorType.SERVER, undefined, { status: 500 });
      }
      if (scenario === 'empty' && path === '/courses.json') {
        return [];
      }
      const body = FIXTURES[path];
      if (body === undefined) {
        throw new AppError(ErrorType.SERVER, undefined, { status: 404 });
      }
      return JSON.parse(JSON.stringify(body));
    },

    async post(path, body) {
      await simulateRequest();
      if (path !== '/auth/login') {
        throw new AppError(ErrorType.SERVER, undefined, { status: 404 });
      }
      if (body.email === 'fail@test.com') {
        throw new AppError(
          ErrorType.UNAUTHORIZED,
          'Invalid email or password',
          { status: 401 },
        );
      }
      return {
        token: `mock-token-${Date.now()}`,
        user: { email: body.email, name: body.email.split('@')[0] },
      };
    },
  };
}
