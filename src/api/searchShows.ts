import { ApiError } from './ApiError';
import { API_URL, REQUEST_TIMEOUT_MS } from './constants';
import type { ShowSearchResult } from './types';

export const searchShows = async (query: string, signal?: AbortSignal): Promise<ShowSearchResult[]> => {
  // The request is aborted either by React Query (a newer query) or by the timeout on a hanging network
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const response = await fetch(`${API_URL}/search/shows?q=${encodeURIComponent(query)}`, {
    signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
  });

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return response.json() as Promise<ShowSearchResult[]>;
};
