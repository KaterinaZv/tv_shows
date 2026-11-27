import { randomUUID } from 'node:crypto';

import type { LoginResponse } from '@tv-shows/shared/auth';

import { sessionsStore } from '../../../stores/sessionsStore';

// Use case: the user logs in with an email. Every login opens a new session; favorites are kept by email, not by session
export const login = (email: string): LoginResponse => {
  const token = randomUUID();

  sessionsStore.set(token, email);

  return { user: { email }, token };
};
