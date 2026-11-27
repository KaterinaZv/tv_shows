import { sessionsStore } from '../stores/sessionsStore';

// Email of the user behind the session token; null for a guest or a closed / forgotten session
export const getSessionEmail = (token: string | null) => (token ? sessionsStore.get(token) : null);
