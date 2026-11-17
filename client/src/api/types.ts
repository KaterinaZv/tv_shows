export type HttpMethod = 'GET' | 'POST' | 'DELETE';

export type RequestOptions = {
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
};
