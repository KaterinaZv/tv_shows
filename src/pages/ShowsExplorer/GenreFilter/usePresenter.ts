import { useTranslation } from 'react-i18next';

import { ALL_GENRES_VALUE } from './constants';
import type { Props } from './types';

export const usePresenter = ({ genres, selectedGenres, onGenreToggle, onReset }: Props) => {
  const { t } = useTranslation();

  return {
    hasGenres: genres.length > 0,
    groupLabel: t('genres.groupLabel'),
    chips: [
      { value: ALL_GENRES_VALUE, label: t('genres.all'), isActive: selectedGenres.length === 0 },
      ...genres.map((genre) => ({ value: genre, label: genre, isActive: selectedGenres.includes(genre) })),
    ],
    handleSelect: (value: string) => (value === ALL_GENRES_VALUE ? onReset() : onGenreToggle(value)),
  };
};
