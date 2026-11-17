import type { ApiErrorResponse } from '@tv-shows/shared/shows';
import type { ErrorRequestHandler } from 'express';

import { HttpRequestError } from '../shared/errors';

// Translates errors from tasks into HTTP responses; unexpected errors become 500 without leaking internals
export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  const send = (status: number, message: string) => {
    const body: ApiErrorResponse = { message };

    response.status(status).json(body);
  };

  if (error instanceof HttpRequestError) {
    // TVmaze asked to slow down: pass 429 through so the client can show a specific message
    if (error.status === 429) return send(429, 'TVmaze rate limit exceeded');

    return send(502, 'TVmaze is unavailable');
  }

  if (error instanceof Error && error.name === 'TimeoutError') {
    return send(504, 'TVmaze did not respond in time');
  }

  console.error(error);
  send(500, 'Internal server error');
};
