export const DEFAULT_PORT = 3000;

export const DEFAULT_CLIENT_ORIGINS = ['http://localhost:5173'];

export const AUTHORIZATION_HEADER = 'Authorization';

export const TVMAZE_API_URL = 'https://api.tvmaze.com';

export const TVMAZE_TIMEOUT_MS = 10_000;

// The same TVmaze request within this window is served from the in-memory cache
export const TVMAZE_CACHE_TTL_MS = 5 * 60 * 1000;

export const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&nbsp;': ' ',
  '&ndash;': '–',
  '&mdash;': '—',
  '&hellip;': '…',
};
