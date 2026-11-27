import { clearAuthToken } from '@/api/authToken';
import { httpClient } from '@/api/httpClient';

// Logs out: the backend closes the session. The token is dropped even if the request fails,
// so the user is logged out on this device in any case
export const logout = async () => {
  try {
    await httpClient.post<void>('/api/auth/logout');
  } finally {
    clearAuthToken();
  }
};
