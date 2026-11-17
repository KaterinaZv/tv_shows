import { TOAST_DURATION_MS } from '@/shared/constants/toasts';
import { toastsStore } from '@/stores/toastsStore';
import type { ToastVariant } from '@/stores/types';

import { dismissToast } from './dismissToast';

let nextToastId = 1;

// Shows a notification and hides it after a few seconds. The text comes ready from the presenter (i18n)
export const showToast = (message: string, variant: ToastVariant = 'success') => {
  const id = nextToastId++;

  toastsStore.set([...toastsStore.get(), { id, message, variant }]);
  setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
};
