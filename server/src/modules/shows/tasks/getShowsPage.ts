import type { ShowsPageResponse } from '@tv-shows/shared/shows';

import { markFavorites } from '../../../tasks/markFavorites';
import { PAGE_SIZE } from '../constants';
import type { ShowsPageParams } from '../types';
import { collectGenres } from './collectGenres';
import { filterShowsByGenres } from './filterShowsByGenres';
import { paginate } from './paginate';
import { searchShows } from './searchShows';

// Use case: the user searches shows, optionally narrows them by genres and opens a page of results
export const getShowsPage = async ({ clientId, query, genres, page }: ShowsPageParams): Promise<ShowsPageResponse> => {
  const shows = await searchShows(query);
  const filteredShows = filterShowsByGenres(shows, genres);
  const pageData = paginate(filteredShows, page, PAGE_SIZE);

  return {
    ...pageData,
    items: markFavorites(clientId, pageData.items),
    genres: collectGenres(shows),
    total: shows.length,
    filteredTotal: filteredShows.length,
    pageSize: PAGE_SIZE,
  };
};
