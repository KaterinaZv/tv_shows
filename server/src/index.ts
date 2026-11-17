import express from 'express';

import { cors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { healthRoutes } from './modules/health/routes';
import { showsRoutes } from './modules/shows/routes';
import { env } from './shared/env';

const app = express();

app.use(cors);
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/shows', showsRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
