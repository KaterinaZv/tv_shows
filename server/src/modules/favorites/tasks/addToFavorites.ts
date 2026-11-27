import type { FavoriteChangeResponse } from '@tv-shows/shared/favorites';

import { HttpRequestError, NotFoundError } from '../../../shared/errors';
import type { TvmazeShow } from '../../../shared/types/tvmaze';
import { favoritesStore } from '../../../stores/favoritesStore';
import { fetchTvmaze } from '../../../tasks/fetchTvmaze';
import { mapTvmazeShow } from '../../../tasks/mapTvmazeShow';

const fetchShow = async (showId: number) => {
  try {
    return mapTvmazeShow(await fetchTvmaze<TvmazeShow>(`/shows/${showId}`));
  } catch (error) {
    if (error instanceof HttpRequestError && error.status === 404) throw new NotFoundError('Show not found');

    throw error;
  }
};

// Use case: the user stars a show. The server takes show data from TVmaze itself, the client sends only the id
export const addToFavorites = async (email: string, showId: number): Promise<FavoriteChangeResponse> => {
  const favorites = favoritesStore.get(email);

  if (!(showId in favorites)) {
    const show = await fetchShow(showId);

    favoritesStore.set(email, { ...favoritesStore.get(email), [showId]: { show, addedAt: Date.now() } });
  }

  return { showId, isFavorite: true, count: Object.keys(favoritesStore.get(email)).length };
};
