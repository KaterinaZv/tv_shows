import type { Show } from '@/api/types';

// Unique genres of the found shows, sorted alphabetically
export const collectGenres = (shows: Show[]) => [...new Set(shows.flatMap((show) => show.genres))].sort();
