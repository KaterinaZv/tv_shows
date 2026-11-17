import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoritesResponse } from '@tv-shows/shared/favorites';
import type { ShowsPageResponse } from '@tv-shows/shared/shows';

import { FAVORITES_QUERY_KEY, SHOWS_QUERY_KEY } from '@/shared/constants/queryKeys';

import { toggleFavorite } from './tasks/toggleFavorite';
import { updateFavoritesList } from './tasks/updateFavoritesList';
import { updateShowsPageFavorite } from './tasks/updateShowsPageFavorite';

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    // The server response already has the new state: update the cache in place instead of refetching
    onSuccess: (change, { show }) => {
      queryClient.setQueriesData<ShowsPageResponse>(
        { queryKey: SHOWS_QUERY_KEY },
        (page) => page && updateShowsPageFavorite(page, change),
      );
      queryClient.setQueryData<FavoritesResponse>(
        FAVORITES_QUERY_KEY,
        (favorites) => favorites && updateFavoritesList(favorites, change, show),
      );
    },
  });
};
