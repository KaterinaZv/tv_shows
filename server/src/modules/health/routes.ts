import type { HealthResponse } from '@tv-shows/shared/health';
import { Router } from 'express';

export const healthRoutes = Router();

healthRoutes.get('/', (_request, response) => {
  const body: HealthResponse = { status: 'ok', uptimeSeconds: Math.round(process.uptime()) };

  response.json(body);
});
