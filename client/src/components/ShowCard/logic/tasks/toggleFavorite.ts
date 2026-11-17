import type { FavoriteChangeResponse } from '@tv-shows/shared/favorites';

import { httpClient } from '@/api/httpClient';

import type { ToggleFavoriteParams } from '../../types';

// Stars or unstars a show; the backend owns the favorites and returns the new state
export const toggleFavorite = ({ show }: ToggleFavoriteParams) =>
  show.isFavorite
    ? httpClient.delete<FavoriteChangeResponse>(`/api/favorites/${show.id}`)
    : httpClient.post<FavoriteChangeResponse>(`/api/favorites/${show.id}`);
