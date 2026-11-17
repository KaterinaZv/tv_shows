import type { Show } from '@tv-shows/shared/shows';

import { tvmaze } from '../../../dal/tvmaze';
import { searchCacheStore } from '../../../stores/searchCacheStore';
import { SEARCH_CACHE_TTL_MS } from '../constants';
import type { TvmazeSearchResult, TvmazeShow } from '../types';
import { stripHtml } from '../utils';

const toShow = (show: TvmazeShow): Show => ({
  id: show.id,
  url: show.url,
  name: show.name,
  language: show.language,
  genres: show.genres,
  status: show.status,
  premiered: show.premiered,
  ended: show.ended,
  rating: show.rating.average,
  channel: show.network?.name ?? show.webChannel?.name ?? null,
  imageUrl: show.image?.medium ?? null,
  summary: stripHtml(show.summary),
});

// Searches TVmaze by title. The same query within the TTL is served from the in-memory cache
export const searchShows = async (query: string): Promise<Show[]> => {
  const key = query.toLowerCase();
  const cached = searchCacheStore.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    console.info(`[cache] hit "${key}"`);

    return cached.shows;
  }

  console.info(`[cache] miss "${key}" → TVmaze`);

  const results = await tvmaze.get<TvmazeSearchResult[]>('/search/shows', { params: { q: query } });
  const shows = results.map((result) => toShow(result.show));

  searchCacheStore.set(key, { shows, expiresAt: Date.now() + SEARCH_CACHE_TTL_MS });

  return shows;
};
