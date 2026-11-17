import type { ShowData } from '@tv-shows/shared/shows';

// Unique genres of the found shows, sorted alphabetically
export const collectGenres = (shows: ShowData[]) => [...new Set(shows.flatMap((show) => show.genres))].sort();
