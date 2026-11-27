import { HTML_ENTITIES } from './constants';

const decodeEntities = (text: string) =>
  text
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&[a-z]+;/gi, (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? entity);

// TVmaze summaries are HTML: keep plain text only, with entities like &amp; decoded
export const stripHtml = (html: string | null) =>
  html
    ? decodeEntities(html.replace(/<[^>]*>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim()
    : null;

// Positive integer from a route or query parameter, otherwise null
export const parsePositiveInt = (value: unknown) => {
  const number = typeof value === 'string' && value.length > 0 ? Number(value) : NaN;

  return Number.isInteger(number) && number > 0 ? number : null;
};

// Token from the "Authorization: Bearer <token>" header, otherwise null
export const parseBearerToken = (header: string | undefined) => {
  const [scheme, token] = header?.split(' ') ?? [];

  return scheme === 'Bearer' && token ? token : null;
};
