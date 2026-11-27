import type { ApiErrorResponse } from '@tv-shows/shared/shows';
import type { RequestHandler } from 'express';

// Guards routes that work with personal data: only a logged-in user gets through
export const requireAuth: RequestHandler = (_request, response, next) => {
  if (!response.locals.userEmail) {
    const body: ApiErrorResponse = { message: 'Login required' };

    response.status(401).json(body);

    return;
  }

  next();
};
