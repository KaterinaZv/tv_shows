import type { FavoritesResponse } from '@tv-shows/shared/favorites';

import { favoritesStore } from '../../../stores/favoritesStore';

// Use case: the user opens the list of favorites — newest first
export const getFavorites = (email: string): FavoritesResponse => {
  const entries = Object.values(favoritesStore.get(email)).sort((a, b) => b.addedAt - a.addedAt);

  return {
    items: entries.map((entry) => ({ ...entry.show, isFavorite: true })),
    count: entries.length,
  };
};
