import { HttpRequestError } from '../shared/errors';
import type { HttpClientOptions, RequestOptions } from './types';

// DAL: a thin wrapper over fetch. It knows nothing about endpoints — tasks pass the path and params
export const createHttpClient = ({ baseUrl, timeoutMs }: HttpClientOptions) => ({
  get: async <T>(path: string, { params = {} }: RequestOptions = {}): Promise<T> => {
    const url = new URL(path, baseUrl);

    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    // AbortSignal.timeout() rejects with a DOMException named TimeoutError
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });

    if (!response.ok) {
      throw new HttpRequestError(response.status);
    }

    return (await response.json()) as T;
  },
});
