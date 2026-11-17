import type { SearchCacheEntry } from './types';

// In-memory "table" of TVmaze search results: key is the normalized query. Lives as long as the process
const cache: Record<string, SearchCacheEntry> = {};

export const searchCacheStore = {
  get: (key: string): SearchCacheEntry | undefined => cache[key],
  set: (key: string, entry: SearchCacheEntry) => {
    cache[key] = entry;
  },
};
