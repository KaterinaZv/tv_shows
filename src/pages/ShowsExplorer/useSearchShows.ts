import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchShows } from '@/api/searchShows';

import { SEARCH_SHOWS_QUERY_KEY } from './constants';
import { shouldRetrySearch } from './utils';

export const useSearchShows = (query: string) =>
  useQuery({
    queryKey: [...SEARCH_SHOWS_QUERY_KEY, query],
    // signal cancels the request if the user has already typed a new query
    queryFn: ({ signal }) => searchShows(query, signal),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
    retry: shouldRetrySearch,
  });
