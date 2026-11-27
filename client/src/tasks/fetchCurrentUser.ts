import type { CurrentUserResponse, User } from '@tv-shows/shared/auth';

import { clearAuthToken, getAuthToken } from '@/api/authToken';
import { httpClient } from '@/api/httpClient';

// Who is logged in. A guest without a token does not need a request at all.
// The backend forgets sessions on restart: a token it no longer knows is dropped
export const fetchCurrentUser = async (signal?: AbortSignal): Promise<User | null> => {
  if (!getAuthToken()) return null;

  const { user } = await httpClient.get<CurrentUserResponse>('/api/auth/me', { signal });

  if (!user) clearAuthToken();

  return user;
};
