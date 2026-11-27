import type { Show, ShowData } from '@tv-shows/shared/shows';

import { favoritesStore } from '../stores/favoritesStore';

// Adds the favorite flag of the given user to every show; a guest has no favorites
export const markFavorites = (email: string | null, shows: ShowData[]): Show[] => {
  const favorites = email ? favoritesStore.get(email) : {};

  return shows.map((show) => ({ ...show, isFavorite: show.id in favorites }));
};
