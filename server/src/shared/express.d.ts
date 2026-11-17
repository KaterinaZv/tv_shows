import 'express';

declare global {
  namespace Express {
    interface Locals {
      // Set by the requireClientId middleware
      clientId: string;
    }
  }
}
