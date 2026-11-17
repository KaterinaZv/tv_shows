import type { FavoriteChangeResponse } from '@tv-shows/shared/favorites';
import type { ShowsPageResponse } from '@tv-shows/shared/shows';

// The star of the changed show on a search page follows the state returned by the server
export const updateShowsPageFavorite = (page: ShowsPageResponse, { showId, isFavorite }: FavoriteChangeResponse) => ({
  ...page,
  items: page.items.map((show) => (show.id === showId ? { ...show, isFavorite } : show)),
});
