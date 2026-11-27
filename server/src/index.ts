import express from 'express';

import { authenticate } from './middleware/authenticate';
import { cors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { requireAuth } from './middleware/requireAuth';
import { authRoutes } from './modules/auth/routes';
import { favoritesRoutes } from './modules/favorites/routes';
import { healthRoutes } from './modules/health/routes';
import { showsRoutes } from './modules/shows/routes';
import { env } from './shared/env';

const app = express();

app.use(cors);
app.use(express.json());
app.use(authenticate);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shows', showsRoutes);
app.use('/api/favorites', requireAuth, favoritesRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
