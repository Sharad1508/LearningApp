import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.learningdashboard.session';

export const secureStore = {
  async saveSession(session) {
    await Keychain.setGenericPassword('session', JSON.stringify(session), {
      service: SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },
  async loadSession() {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE });
    if (!credentials) {
      return null;
    }
    try {
      return JSON.parse(credentials.password);
    } catch {
      return null;
    }
  },
  async clearSession() {
    await Keychain.resetGenericPassword({ service: SERVICE });
  },
};
