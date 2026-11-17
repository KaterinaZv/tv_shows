import { MAX_GENRES, MAX_QUERY_LENGTH } from './constants';
import type { ShowsPageParams } from './types';

export const stripHtml = (html: string | null) =>
  html
    ? html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : null;

// Validates ?q=&genres=&page= and returns null when the request is malformed
export const parseShowsPageQuery = ({ q, genres, page }: Record<string, unknown>): ShowsPageParams | null => {
  const query = typeof q === 'string' ? q.trim() : '';
  const genreList =
    typeof genres === 'string' && genres.length > 0
      ? genres
          .split(',')
          .map((genre) => genre.trim())
          .filter(Boolean)
      : [];
  const pageNumber = page === undefined ? 1 : Number(page);

  if (query.length === 0 || query.length > MAX_QUERY_LENGTH) return null;
  if (genreList.length > MAX_GENRES) return null;
  if (!Number.isInteger(pageNumber) || pageNumber < 1) return null;

  return { query, genres: genreList, page: pageNumber };
};
