import type { Show } from '@/api/types';

export const SEARCH_DEBOUNCE_MS = 400;

export const EMPTY_SHOWS: Show[] = [];

export const SEARCH_SHOWS_QUERY_KEY = ['shows', 'search'] as const;

export const MAX_SEARCH_RETRIES = 1;

export const NO_GENRES: string[] = [];
