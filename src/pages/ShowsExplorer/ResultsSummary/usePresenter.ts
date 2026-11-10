import { useTranslation } from 'react-i18next';

import type { Props } from './types';

export const usePresenter = ({ query, total, filtered, genres, isUpdating }: Props) => {
  const { t } = useTranslation();

  if (isUpdating) {
    return { summary: t('results.searching', { query }) };
  }

  return {
    summary:
      genres.length > 0
        ? t('results.filtered', { count: total, filtered, genres: genres.join(', ') })
        : t('results.found', { count: total, query }),
  };
};
