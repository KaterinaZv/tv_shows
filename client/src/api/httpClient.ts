import { ApiError } from './ApiError';
import { getClientId } from './clientId';
import { API_BASE_URL, CLIENT_ID_HEADER, REQUEST_TIMEOUT_MS } from './constants';
import type { RequestOptions } from './types';

const buildUrl = (path: string, params: RequestOptions['params'] = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  });

  return url;
};

// DAL: a thin wrapper over fetch for our backend. Endpoints and mapping live in tasks
export const httpClient = {
  get: async <T>(path: string, { params, signal }: RequestOptions = {}): Promise<T> => {
    // The request is aborted either by React Query (a newer query) or by the timeout on a hanging network
    const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const response = await fetch(buildUrl(path, params), {
      headers: { [CLIENT_ID_HEADER]: getClientId() },
      signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
    });

    if (!response.ok) {
      throw new ApiError(response.status);
    }

    return (await response.json()) as T;
  },
};
