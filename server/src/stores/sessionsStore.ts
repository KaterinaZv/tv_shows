// In-memory "table" of sessions: token → email of the user, null for a closed session. Lives as long as the process
const sessions: Record<string, string | null> = {};

export const sessionsStore = {
  get: (token: string): string | null => sessions[token] ?? null,
  set: (token: string, email: string | null) => {
    sessions[token] = email;
  },
};
