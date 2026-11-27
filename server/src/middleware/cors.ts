import corsMiddleware from 'cors';

import { AUTHORIZATION_HEADER } from '../shared/constants';
import { env } from '../shared/env';

export const cors = corsMiddleware({
  origin: env.clientOrigins,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', AUTHORIZATION_HEADER],
});
