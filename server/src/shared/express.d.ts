import 'express';

declare global {
  namespace Express {
    interface Locals {
      // Set by the authenticate middleware: the raw session token and its user; both null for a guest
      token: string | null;
      userEmail: string | null;
    }
  }
}
