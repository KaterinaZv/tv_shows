import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SHOWS_PAGE_QUERY_KEY } from '../constants';
import type { ShowsPageParams } from '../types';
import { shouldRetrySearch } from '../utils';
import { fetchShowsPage } from './tasks/fetchShowsPage';

export const useShowsPage = ({ query, genres, page }: ShowsPageParams) =>
  useQuery({
    // Genres are sorted so that the same selection in a different order hits the same cache entry
    queryKey: [...SHOWS_PAGE_QUERY_KEY, query, [...genres].sort(), page],
    // signal cancels the request if the user has already changed the query, genres or page
    queryFn: ({ signal }) => fetchShowsPage({ query, genres, page }, signal),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
    retry: shouldRetrySearch,
  });
