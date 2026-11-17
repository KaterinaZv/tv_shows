import { useState } from 'react';

import { NO_GENRES } from '../constants';
import type { GenreState } from '../types';
import { toggleGenre } from './tasks/toggleGenre';

// Keeps only the user's selection: filtering itself happens on the backend
export const useGenreFilter = (resetKey: string) => {
  const [state, setState] = useState<GenreState>({ resetKey, genres: NO_GENRES });

  // Reset the stored selection itself, so returning to a previous query does not restore old genres
  if (state.resetKey !== resetKey) {
    setState({ resetKey, genres: NO_GENRES });
  }

  const selectedGenres = state.resetKey === resetKey ? state.genres : NO_GENRES;

  return {
    selectedGenres,
    toggleGenre: (genre: string) => setState({ resetKey, genres: toggleGenre(selectedGenres, genre) }),
    resetGenres: () => setState({ resetKey, genres: NO_GENRES }),
  };
};
