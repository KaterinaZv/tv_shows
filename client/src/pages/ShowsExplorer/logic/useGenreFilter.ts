import { useState } from 'react';

import { NO_GENRES } from '../constants';
import type { GenreFilterParams, GenreState } from '../types';
import { collectGenres } from './tasks/collectGenres';
import { filterShowsByGenres } from './tasks/filterShowsByGenres';
import { toggleGenre } from './tasks/toggleGenre';

export const useGenreFilter = ({ shows, resetKey }: GenreFilterParams) => {
  const [state, setState] = useState<GenreState>({ resetKey, genres: NO_GENRES });
  const selectedGenres = state.resetKey === resetKey ? state.genres : NO_GENRES;

  return {
    genres: collectGenres(shows),
    selectedGenres,
    filteredShows: filterShowsByGenres(shows, selectedGenres),
    toggleGenre: (genre: string) => setState({ resetKey, genres: toggleGenre(selectedGenres, genre) }),
    resetGenres: () => setState({ resetKey, genres: NO_GENRES }),
  };
};
