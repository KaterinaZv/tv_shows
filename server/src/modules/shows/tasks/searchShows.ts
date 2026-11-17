import type { ShowData } from '@tv-shows/shared/shows';

import type { TvmazeSearchResult } from '../../../shared/types/tvmaze';
import { fetchTvmaze } from '../../../tasks/fetchTvmaze';
import { mapTvmazeShow } from '../../../tasks/mapTvmazeShow';

// Searches TVmaze by title (cached for 5 minutes)
export const searchShows = async (query: string): Promise<ShowData[]> => {
  const results = await fetchTvmaze<TvmazeSearchResult[]>('/search/shows', { q: query });

  return results.map((result) => mapTvmazeShow(result.show));
};
