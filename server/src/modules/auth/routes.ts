import type { ApiErrorResponse } from '@tv-shows/shared/shows';
import { Router } from 'express';

import { getCurrentUser } from './tasks/getCurrentUser';
import { login } from './tasks/login';
import { logout } from './tasks/logout';
import { parseEmail } from './utils';

export const authRoutes = Router();

// POST /api/auth/login { email }
authRoutes.post('/login', (request, response) => {
  const email = parseEmail(request.body);

  if (!email) {
    const body: ApiErrorResponse = { message: 'A valid email is required' };

    response.status(400).json(body);

    return;
  }

  response.json(login(email));
});

// GET /api/auth/me
authRoutes.get('/me', (_request, response) => {
  response.json(getCurrentUser(response.locals.userEmail));
});

// POST /api/auth/logout
authRoutes.post('/logout', (_request, response) => {
  logout(response.locals.token);
  response.status(204).end();
});
