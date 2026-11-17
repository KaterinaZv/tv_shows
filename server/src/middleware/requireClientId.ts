import type { ApiErrorResponse } from '@tv-shows/shared/shows';
import type { RequestHandler } from 'express';

import { CLIENT_ID_HEADER, CLIENT_ID_PATTERN } from '../shared/constants';

// Every browser has its own favorites: the client sends its anonymous id in the X-Client-Id header
export const requireClientId: RequestHandler = (request, response, next) => {
  const clientId = request.get(CLIENT_ID_HEADER);

  if (!clientId || !CLIENT_ID_PATTERN.test(clientId)) {
    const body: ApiErrorResponse = { message: `${CLIENT_ID_HEADER} header with a UUID is required` };

    response.status(400).json(body);

    return;
  }

  response.locals.clientId = clientId;
  next();
};
