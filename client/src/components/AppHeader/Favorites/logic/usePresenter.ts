import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NO_FAVORITES } from '../constants';
import { useFavorites } from './useFavorites';

export const usePresenter = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending, isError } = useFavorites();
  const count = data?.count ?? 0;

  return {
    isOpen,
    count,
    buttonIcon: '★',
    buttonLabel: t('favorites.button'),
    buttonAriaLabel: t('favorites.buttonAria', { count }),
    drawerTitle: t('favorites.title'),
    closeLabel: t('favorites.close'),
    loadingLabel: t('common.loading'),
    shows: data?.items ?? NO_FAVORITES,
    isLoading: isPending,
    isEmpty: !isPending && !isError && count === 0,
    emptyText: t('favorites.empty'),
    isError,
    errorText: t('favorites.loadError'),
    handleOpen: () => setIsOpen(true),
    handleClose: () => setIsOpen(false),
  };
};
