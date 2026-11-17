import type { Show, ShowData } from '@tv-shows/shared/shows';

import { favoritesStore } from '../stores/favoritesStore';

// Adds the favorite flag of the given client to every show
export const markFavorites = (clientId: string, shows: ShowData[]): Show[] => {
  const favorites = favoritesStore.get(clientId);

  return shows.map((show) => ({ ...show, isFavorite: show.id in favorites }));
};
