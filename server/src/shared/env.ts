import { DEFAULT_CLIENT_ORIGINS, DEFAULT_PORT } from './constants';

export const env = {
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  // Comma-separated list of origins allowed to call the API (GitHub Pages in production)
  clientOrigins: process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()) ?? DEFAULT_CLIENT_ORIGINS,
};
