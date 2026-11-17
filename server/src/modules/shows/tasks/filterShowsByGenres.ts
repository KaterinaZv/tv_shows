import type { ShowData } from '@tv-shows/shared/shows';

const hasAnyGenre = (show: ShowData, genres: string[]) => show.genres.some((genre) => genres.includes(genre));

// OR logic: a show matches if it has at least one of the selected genres; no genres means no filter
export const filterShowsByGenres = (shows: ShowData[], genres: string[]) =>
  genres.length > 0 ? shows.filter((show) => hasAnyGenre(show, genres)) : shows;
