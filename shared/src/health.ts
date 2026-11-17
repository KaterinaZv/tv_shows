// GET /api/health
export type HealthResponse = {
  status: 'ok';
  uptimeSeconds: number;
};
