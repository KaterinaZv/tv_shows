import type { Show } from '@tv-shows/shared/shows';

export const SEARCH_DEBOUNCE_MS = 400;

export const EMPTY_SHOWS: Show[] = [];

export const SHOWS_PAGE_QUERY_KEY = ['shows', 'page'] as const;

export const MAX_SEARCH_RETRIES = 1;

export const NO_GENRES: string[] = [];
