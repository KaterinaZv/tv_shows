import corsMiddleware from 'cors';

import { CLIENT_ID_HEADER } from '../shared/constants';
import { env } from '../shared/env';

export const cors = corsMiddleware({
  origin: env.clientOrigins,
  allowedHeaders: ['Content-Type', CLIENT_ID_HEADER],
});
