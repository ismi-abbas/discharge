import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export async function load(key: string): Promise<unknown | null> {
  try {
    const data = await AsyncStorage.getItem(key);
    return JSON.parse(data ?? '');
  } catch {
    return null;
  }
}

export async function save(key: string, value: unknown): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}

export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {}
}

export async function getAllKeys(): Promise<readonly string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch {
    return [];
  }
}
