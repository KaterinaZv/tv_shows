import { AUTH_TOKEN_STORAGE_KEY } from './constants';

let memoryToken: string | null = null;

// Session token from the backend: kept in localStorage so the user stays logged in after a reload.
// Falls back to memory if storage is blocked (private mode): then the session lasts until the tab is closed
export const getAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return memoryToken;
  }
};

export const saveAuthToken = (token: string) => {
  memoryToken = token;

  try {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch {
    // Storage is blocked: the in-memory token is enough
  }
};

export const clearAuthToken = () => {
  memoryToken = null;

  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // Storage is blocked: nothing to remove
  }
};
