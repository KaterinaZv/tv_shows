import type { Show } from './shows';

// GET /api/favorites — newest first
export type FavoritesResponse = {
  items: Show[];
  count: number;
};

// POST /api/favorites/:showId and DELETE /api/favorites/:showId
export type FavoriteChangeResponse = {
  showId: number;
  isFavorite: boolean;
  count: number;
};
