import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoritesResponse } from '@tv-shows/shared/favorites';
import type { ShowsPageResponse } from '@tv-shows/shared/shows';

import { FAVORITES_QUERY_KEY, SHOWS_QUERY_KEY } from '@/shared/constants/queryKeys';

import { applyFavoriteToFavorites } from './tasks/applyFavoriteToFavorites';
import { applyFavoriteToShowsPage } from './tasks/applyFavoriteToShowsPage';
import { toggleFavorite } from './tasks/toggleFavorite';

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    // The server response already has the new state: update the cache in place instead of refetching
    onSuccess: (change, { show }) => {
      queryClient.setQueriesData<ShowsPageResponse>(
        { queryKey: SHOWS_QUERY_KEY },
        (page) => page && applyFavoriteToShowsPage(page, change),
      );
      queryClient.setQueryData<FavoritesResponse>(
        FAVORITES_QUERY_KEY,
        (favorites) => favorites && applyFavoriteToFavorites(favorites, change, show),
      );
    },
  });
};
