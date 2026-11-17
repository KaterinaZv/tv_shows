import type { FavoriteChangeResponse } from '@tv-shows/shared/favorites';

import { favoritesStore } from '../../../stores/favoritesStore';

// Use case: the user unstars a show. Removing a show that is not in favorites is not an error
export const removeFromFavorites = (clientId: string, showId: number): FavoriteChangeResponse => {
  const remaining = Object.fromEntries(
    Object.entries(favoritesStore.get(clientId)).filter(([id]) => Number(id) !== showId),
  );

  favoritesStore.set(clientId, remaining);

  return { showId, isFavorite: false, count: Object.keys(remaining).length };
};
