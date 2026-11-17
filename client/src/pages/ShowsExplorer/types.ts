import type { Show } from '@/api/types';

export type GenreFilterParams = {
  shows: Show[];
  // Any change of the key resets the filter to all genres
  resetKey: string;
};

export type GenreState = {
  resetKey: string;
  genres: string[];
};

export type SearchStatusFlags = {
  isIdle: boolean;
  isOffline: boolean;
  isError: boolean;
  isEmpty: boolean;
};
