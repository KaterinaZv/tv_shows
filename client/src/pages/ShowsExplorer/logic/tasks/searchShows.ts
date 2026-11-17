import { fetchShowSearch } from '@/api/fetchShowSearch';
import type { Show } from '@/api/types';

// Search shows by title; TVmaze wraps every show into a result with a relevance score
export const searchShows = async (query: string, signal?: AbortSignal): Promise<Show[]> => {
  const results = await fetchShowSearch(query, signal);

  return results.map((result) => result.show);
};
