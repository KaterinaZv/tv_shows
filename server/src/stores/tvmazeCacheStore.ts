import type { CacheEntry } from './types';

// In-memory "table" of TVmaze responses: key is the request path with params. Lives as long as the process
const cache: Record<string, CacheEntry> = {};

export const tvmazeCacheStore = {
  get: (key: string): CacheEntry | undefined => cache[key],
  set: (key: string, entry: CacheEntry) => {
    cache[key] = entry;
  },
};
