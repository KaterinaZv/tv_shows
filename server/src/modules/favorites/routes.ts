import type { ApiErrorResponse } from '@tv-shows/shared/shows';
import { Router } from 'express';

import { parsePositiveInt } from '../../shared/utils';
import { addToFavorites } from './tasks/addToFavorites';
import { getFavorites } from './tasks/getFavorites';
import { removeFromFavorites } from './tasks/removeFromFavorites';

export const favoritesRoutes = Router();

const INVALID_SHOW_ID: ApiErrorResponse = { message: 'showId must be a positive integer' };

// GET /api/favorites
favoritesRoutes.get('/', (_request, response) => {
  response.json(getFavorites(response.locals.clientId));
});

// POST /api/favorites/:showId
favoritesRoutes.post('/:showId', async (request, response) => {
  const showId = parsePositiveInt(request.params.showId);

  if (!showId) {
    response.status(400).json(INVALID_SHOW_ID);

    return;
  }

  response.json(await addToFavorites(response.locals.clientId, showId));
});

// DELETE /api/favorites/:showId
favoritesRoutes.delete('/:showId', (request, response) => {
  const showId = parsePositiveInt(request.params.showId);

  if (!showId) {
    response.status(400).json(INVALID_SHOW_ID);

    return;
  }

  response.json(removeFromFavorites(response.locals.clientId, showId));
});
