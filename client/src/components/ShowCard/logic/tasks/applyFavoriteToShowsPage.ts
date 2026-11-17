import type { FavoriteChangeResponse } from '@tv-shows/shared/favorites';
import type { ShowsPageResponse } from '@tv-shows/shared/shows';

// Updates the star of the changed show on a cached search page, using the state returned by the server
export const applyFavoriteToShowsPage = (page: ShowsPageResponse, { showId, isFavorite }: FavoriteChangeResponse) => ({
  ...page,
  items: page.items.map((show) => (show.id === showId ? { ...show, isFavorite } : show)),
});
