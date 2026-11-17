import type { Show } from '@tv-shows/shared/shows';

export type SearchCacheEntry = {
  shows: Show[];
  // Unix time in ms after which the entry is stale
  expiresAt: number;
};
