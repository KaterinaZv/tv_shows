// Empty in development: requests go to /api on the same origin and Vite proxies them to the local server
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

// Generous on purpose: a sleeping free Render instance needs up to a minute to wake up
export const REQUEST_TIMEOUT_MS = 70_000;

export const CLIENT_ID_HEADER = 'X-Client-Id';

export const CLIENT_ID_STORAGE_KEY = 'clientId';
