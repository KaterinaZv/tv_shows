import { useTranslation } from 'react-i18next';

import { SKELETON_CARDS_COUNT } from '../constants';

export const usePresenter = () => {
  const { t } = useTranslation();

  return {
    ariaLabel: t('results.loading'),
    wakingUpHint: t('results.wakingUp'),
    cards: Array.from({ length: SKELETON_CARDS_COUNT }, (_, index) => ({ id: index })),
  };
};
