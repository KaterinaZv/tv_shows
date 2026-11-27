import type { CurrentUserResponse } from '@tv-shows/shared/auth';

// Use case: the client asks who is logged in (e.g. after a page reload)
export const getCurrentUser = (email: string | null): CurrentUserResponse => ({ user: email ? { email } : null });
