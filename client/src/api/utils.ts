import { ApiError } from './ApiError';

export const isRateLimitError = (error: Error | null) => error instanceof ApiError && error.status === 429;

// AbortSignal.timeout() rejects with a DOMException named TimeoutError
export const isTimeoutError = (error: Error | null) => error?.name === 'TimeoutError';
