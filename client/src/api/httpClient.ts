import { ApiError } from './ApiError';
import { getAuthToken } from './authToken';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './constants';
import type { HttpMethod, RequestOptions } from './types';

const buildUrl = (path: string, params: RequestOptions['params'] = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  });

  return url;
};

// A logged-in user is identified by the session token; a guest sends no Authorization header
const buildHeaders = (hasBody: boolean) => {
  const headers: Record<string, string> = {};
  const token = getAuthToken();

  if (token) headers.Authorization = `Bearer ${token}`;
  if (hasBody) headers['Content-Type'] = 'application/json';

  return headers;
};

const request = async <T>(
  method: HttpMethod,
  path: string,
  { params, signal, body }: RequestOptions = {},
): Promise<T> => {
  // The request is aborted either by React Query (a newer query) or by the timeout on a hanging network
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const response = await fetch(buildUrl(path, params), {
    method,
    headers: buildHeaders(body !== undefined),
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
  });

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  // 204 No Content (e.g. logout) has no body to parse
  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
};

// DAL: a thin wrapper over fetch for our backend. Endpoints and mapping live in tasks
export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptions) => request<T>('POST', path, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
};
