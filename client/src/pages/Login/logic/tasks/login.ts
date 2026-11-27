import type { LoginRequest, LoginResponse, User } from '@tv-shows/shared/auth';

import { saveAuthToken } from '@/api/authToken';
import { httpClient } from '@/api/httpClient';

// Logs in by email: the backend opens a session, the client keeps its token for the next requests
export const login = async (email: string): Promise<User> => {
  const body: LoginRequest = { email };
  const { user, token } = await httpClient.post<LoginResponse>('/api/auth/login', { body });

  saveAuthToken(token);

  return user;
};
