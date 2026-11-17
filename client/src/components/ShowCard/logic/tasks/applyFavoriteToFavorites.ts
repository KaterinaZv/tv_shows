import type { FavoriteChangeResponse, FavoritesResponse } from '@tv-shows/shared/favorites';
import type { Show } from '@tv-shows/shared/shows';

// Adds the show to the top of the cached favorites list or removes it; the count comes from the server
export const applyFavoriteToFavorites = (
  favorites: FavoritesResponse,
  { showId, isFavorite, count }: FavoriteChangeResponse,
  show: Show,
): FavoritesResponse => {
  const others = favorites.items.filter((item) => item.id !== showId);

  return {
    items: isFavorite ? [{ ...show, isFavorite: true }, ...others] : others,
    count,
  };
};
