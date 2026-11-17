import type { ShowsPageQuery, ShowsPageResponse } from '@tv-shows/shared/shows';

import { httpClient } from '@/api/httpClient';

import type { ShowsPageParams } from '../../types';

// Search, genre filtering and pagination happen on the backend; the task only builds the request
export const fetchShowsPage = ({ query, genres, page }: ShowsPageParams, signal?: AbortSignal) => {
  const params: ShowsPageQuery = { q: query, genres: genres.join(','), page };

  return httpClient.get<ShowsPageResponse>('/api/shows', { params, signal });
};
