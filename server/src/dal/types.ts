export type HttpClientOptions = {
  baseUrl: string;
  timeoutMs: number;
};

export type RequestOptions = {
  params?: Record<string, string>;
};
