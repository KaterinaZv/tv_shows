import { useTranslation } from 'react-i18next';

import { PAGE_SIZE } from '@/shared/constants/pagination';

export const usePresenter = () => {
  const { t } = useTranslation();

  return {
    ariaLabel: t('results.loading'),
    cards: Array.from({ length: PAGE_SIZE }, (_, index) => ({ id: index })),
  };
};
