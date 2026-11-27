import { sessionsStore } from '../../../stores/sessionsStore';

// Use case: the user logs out. Only the session is closed: favorites stay with the email for the next login
export const logout = (token: string | null) => {
  if (token) sessionsStore.set(token, null);
};
