// Email format, shared by both sides: the client checks it before sending, the server — as the last line of defense.
// Deliberately simple: something@something.something without spaces. The real check would be a confirmation email
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The longest address allowed by RFC 5321
export const MAX_EMAIL_LENGTH = 254;

export type User = {
  email: string;
};

// POST /api/auth/login — no password: the email is the identity
export type LoginRequest = {
  email: string;
};

// The client sends the token back in the "Authorization: Bearer <token>" header
export type LoginResponse = {
  user: User;
  token: string;
};

// GET /api/auth/me — user is null when the token is missing or the session is gone (logout, server restart)
export type CurrentUserResponse = {
  user: User | null;
};

// POST /api/auth/logout — 204 No Content
