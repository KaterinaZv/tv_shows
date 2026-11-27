import type { FavoritesResponse } from '@tv-shows/shared/favorites';

import { httpClient } from '@/api/httpClient';

// Favorites of the logged-in user (identified by the session token), newest first
export const fetchFavorites = (signal?: AbortSignal) => httpClient.get<FavoritesResponse>('/api/favorites', { signal });
