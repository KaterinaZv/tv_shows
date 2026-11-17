import { CLIENT_ID_STORAGE_KEY } from './constants';

let memoryClientId: string | null = null;

// Anonymous id of this browser: the backend keeps favorites per client. Falls back to memory if storage is blocked
export const getClientId = () => {
  try {
    const stored = localStorage.getItem(CLIENT_ID_STORAGE_KEY);

    if (stored) return stored;

    const created = crypto.randomUUID();

    localStorage.setItem(CLIENT_ID_STORAGE_KEY, created);

    return created;
  } catch {
    memoryClientId ??= crypto.randomUUID();

    return memoryClientId;
  }
};
