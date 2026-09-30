import { config } from '../core/config';
import { isOnline } from '../core/network/connectivity';
import { createHttpClient } from '../core/network/httpClient';
import { createKeyValueStore } from '../core/storage/keyValueStore';
import { secureStore } from '../core/storage/secureStore';
import { createAuthApi } from '../data/api/authApi';
import { createCourseApi } from '../data/api/courseApi';
import { createMockServer } from '../data/api/mockServer';
import { createCourseLocalDataSource } from '../data/local/courseLocalDataSource';
import { createAuthRepository } from '../data/repositories/AuthRepository';
import { createCourseRepository } from '../data/repositories/CourseRepository';

export function createDependencies() {
  const mockServer = createMockServer({
    latencyMs: config.mockLatencyMs,
    scenario: config.mockScenario,
    isOnline,
  });
  // Login is always mocked; courses can come from a real HTTP endpoint.
  const courseClient = config.apiBaseUrl
    ? createHttpClient({
        baseUrl: config.apiBaseUrl,
        timeoutMs: config.requestTimeoutMs,
        getToken: async () => (await secureStore.loadSession())?.token,
      })
    : mockServer;

  return {
    authRepository: createAuthRepository({
      api: createAuthApi(mockServer),
      secureStore,
    }),
    courseRepository: createCourseRepository({
      api: createCourseApi(courseClient),
      local: createCourseLocalDataSource(createKeyValueStore()),
    }),
  };
}
