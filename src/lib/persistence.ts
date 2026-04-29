import { get, set, del } from 'idb-keyval';

export async function loadSetting<T>(key: string, fallback: T): Promise<T> {
  const val = await get<T>(key);
  return val !== undefined ? val : fallback;
}

export async function saveSetting<T>(key: string, value: T): Promise<void> {
  await set(key, value);
}

export async function deleteSetting(key: string): Promise<void> {
  await del(key);
}
