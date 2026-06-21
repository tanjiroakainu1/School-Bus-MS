const APP_DATA_KEY = 'sbms_app_data';
const APP_DATA_VERSION = 1;

export function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}"`, error);
  }
}

export function getAppDataStorageKey() {
  return APP_DATA_KEY;
}

export function getAppDataVersion() {
  return APP_DATA_VERSION;
}
