import { useState } from 'react';

import { NO_GENRES } from './constants';
import type { GenreFilterParams, GenreState } from './types';
import { collectGenres, hasAnyGenre, toggleGenre } from './utils';

export const useGenreFilter = ({ shows, resetKey }: GenreFilterParams) => {
  const [state, setState] = useState<GenreState>({ resetKey, genres: NO_GENRES });
  const selectedGenres = state.resetKey === resetKey ? state.genres : NO_GENRES;

  return {
    genres: collectGenres(shows),
    selectedGenres,
    // OR logic: a show matches if it has at least one of the selected genres
    filteredShows: selectedGenres.length > 0 ? shows.filter((show) => hasAnyGenre(show, selectedGenres)) : shows,
    toggleGenre: (genre: string) => setState({ resetKey, genres: toggleGenre(selectedGenres, genre) }),
    resetGenres: () => setState({ resetKey, genres: NO_GENRES }),
  };
};
