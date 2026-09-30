import AsyncStorage from '@react-native-async-storage/async-storage';

export function createKeyValueStore(storage = AsyncStorage) {
  return {
    async getJSON(key) {
      const raw = await storage.getItem(key);
      if (raw == null) {
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch {
        await storage.removeItem(key);
        return null;
      }
    },
    setJSON: (key, value) => storage.setItem(key, JSON.stringify(value)),
    remove: key => storage.removeItem(key),
  };
}
