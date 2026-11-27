import { EMAIL_PATTERN, MAX_EMAIL_LENGTH } from '@tv-shows/shared/auth';

// Email from the login body, normalized so that "Me@Mail.com " and "me@mail.com" are the same user; null if invalid
export const parseEmail = (body: unknown) => {
  const email =
    typeof body === 'object' && body !== null && 'email' in body && typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';

  return email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email) ? email : null;
};
