import type { ErrorRequestHandler } from 'express';

// Last resort: unexpected errors become 500 without leaking internals to the client
export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'Internal server error' });
};
