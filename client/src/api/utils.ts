import { ApiError } from './ApiError';

export const isRateLimitError = (error: Error | null) => error instanceof ApiError && error.status === 429;

// Either our request timed out (AbortSignal.timeout → TimeoutError) or the backend gave up on TVmaze (504)
export const isTimeoutError = (error: Error | null) =>
  error?.name === 'TimeoutError' || (error instanceof ApiError && error.status === 504);
