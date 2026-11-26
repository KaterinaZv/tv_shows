import { TOAST_DURATION_MS } from '@/shared/constants/toasts';
import type { ToastVariant } from '@/shared/types/toasts';
import { toastsStore } from '@/stores/toastsStore';

import { dismissToast } from './dismissToast';

let nextToastId = 1;

// Shows a notification and hides it after a few seconds. The text comes ready from the presenter (i18n)
export const showToast = (message: string, variant: ToastVariant = 'success') => {
  const id = nextToastId++;

  toastsStore.set([...toastsStore.get(), { id, message, variant }]);
  setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
};
