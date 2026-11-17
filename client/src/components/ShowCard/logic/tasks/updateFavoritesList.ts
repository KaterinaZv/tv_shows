import type { FavoriteChangeResponse, FavoritesResponse } from '@tv-shows/shared/favorites';
import type { Show } from '@tv-shows/shared/shows';

// A new favorite goes to the top (same order as the server's list), a removed one disappears; the count is the server's
export const updateFavoritesList = (
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
