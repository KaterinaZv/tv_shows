import { useTranslation } from 'react-i18next';

import type { Props } from './types';

export const usePresenter = ({ value, isLoading, onChange }: Props) => {
  const { t } = useTranslation();

  return {
    value,
    isLoading,
    placeholder: t('search.placeholder'),
    ariaLabel: t('search.ariaLabel'),
    clearLabel: t('search.clear'),
    loadingLabel: t('common.loading'),
    handleChange: onChange,
  };
};
