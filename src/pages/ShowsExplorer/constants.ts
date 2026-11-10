import type { ShowSearchResult } from '@/api/types';

export const SEARCH_DEBOUNCE_MS = 400;

export const EMPTY_RESULTS: ShowSearchResult[] = [];

export const SEARCH_SHOWS_QUERY_KEY = ['shows', 'search'] as const;

export const MAX_SEARCH_RETRIES = 1;

export const NO_GENRES: string[] = [];
