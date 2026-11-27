import { EMAIL_PATTERN, MAX_EMAIL_LENGTH } from '@tv-shows/shared/auth';

// The same format check as on the server (shared contract): an invalid email is not sent at all
export const isValidEmail = (email: string) => email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email);
