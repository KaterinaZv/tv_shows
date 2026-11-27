import type { RequestHandler } from 'express';

import { AUTHORIZATION_HEADER } from '../shared/constants';
import { parseBearerToken } from '../shared/utils';
import { getSessionEmail } from '../tasks/getSessionEmail';

// Optional auth for every request: guests pass through with userEmail = null, routes decide what they may do
export const authenticate: RequestHandler = (request, response, next) => {
  const token = parseBearerToken(request.get(AUTHORIZATION_HEADER));

  response.locals.token = token;
  response.locals.userEmail = getSessionEmail(token);
  next();
};
