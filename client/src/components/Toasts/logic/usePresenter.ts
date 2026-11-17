import { useTranslation } from 'react-i18next';

import { useStore } from '@/shared/hooks/useStore';
import { toastsStore } from '@/stores/toastsStore';
import { dismissToast } from '@/tasks/dismissToast';

export const usePresenter = () => {
  const { t } = useTranslation();

  return {
    toasts: useStore(toastsStore),
    closeLabel: t('toast.close'),
    handleClose: dismissToast,
  };
};
