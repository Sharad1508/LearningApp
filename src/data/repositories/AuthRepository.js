export function createAuthRepository({ api, secureStore }) {
  return {
    async login(email, password) {
      const session = await api.login(email.trim().toLowerCase(), password);
      await secureStore.saveSession(session);
      return session.user;
    },
    async restoreSession() {
      const session = await secureStore.loadSession();
      return session?.user ?? null;
    },
    logout: () => secureStore.clearSession(),
  };
}
