import type { ShowData } from '@tv-shows/shared/shows';

export type CacheEntry = {
  // Raw TVmaze response; the task that reads it knows its shape
  data: unknown;
  // Unix time in ms after which the entry is stale
  expiresAt: number;
};

export type FavoriteEntry = {
  show: ShowData;
  addedAt: number;
};

// Favorites of one client, keyed by show id
export type ClientFavorites = Record<number, FavoriteEntry>;
