import type { FavoritesResponse } from '@tv-shows/shared/favorites';

import { httpClient } from '@/api/httpClient';

// Favorites of this browser (identified by X-Client-Id), newest first
export const fetchFavorites = (signal?: AbortSignal) => httpClient.get<FavoritesResponse>('/api/favorites', { signal });
