import { mapSession } from '../mappers';

export function createAuthApi(client) {
  return {
    login: async (email, password) =>
      mapSession(await client.post('/auth/login', { email, password })),
  };
}
