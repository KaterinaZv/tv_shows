import { useTranslation } from 'react-i18next';

import { dismissToast } from '@/tasks/dismissToast';

import { useToasts } from './useToasts';

export const usePresenter = () => {
  const { t } = useTranslation();

  return {
    toasts: useToasts(),
    closeLabel: t('toast.close'),
    handleClose: dismissToast,
  };
};
