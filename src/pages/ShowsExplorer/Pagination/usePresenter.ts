import { useTranslation } from 'react-i18next';

import type { Props } from './types';

export const usePresenter = ({ page, totalPages, onPageChange }: Props) => {
  const { t } = useTranslation();

  return {
    ariaLabel: t('pagination.ariaLabel'),
    prevLabel: t('pagination.prev'),
    nextLabel: t('pagination.next'),
    pages: Array.from({ length: totalPages }, (_, index) => ({
      number: index + 1,
      ariaLabel: t('pagination.page', { page: index + 1 }),
      isCurrent: index + 1 === page,
    })),
    isPrevDisabled: page <= 1,
    isNextDisabled: page >= totalPages,
    handlePrev: () => onPageChange(page - 1),
    handleNext: () => onPageChange(page + 1),
    handlePageSelect: onPageChange,
  };
};
