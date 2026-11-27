import type { ApiErrorResponse } from '@tv-shows/shared/shows';
import { Router } from 'express';

import { getShowsPage } from './tasks/getShowsPage';
import { parseShowsPageQuery } from './utils';

export const showsRoutes = Router();

// GET /api/shows?q=murder&genres=Comedy,Drama&page=2
showsRoutes.get('/', async (request, response) => {
  const params = parseShowsPageQuery(request.query);

  if (!params) {
    const body: ApiErrorResponse = { message: 'Invalid query: q is required, page must be a positive integer' };

    response.status(400).json(body);

    return;
  }

  response.json(await getShowsPage({ ...params, userEmail: response.locals.userEmail }));
});
