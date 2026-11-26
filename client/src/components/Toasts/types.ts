import type { ToastVariant } from '@/ui-kit/Toast/types';

// What the View gets from the presenter. It does not repeat the store record,
// so changes in toastsStore stop at the presenter and never reach the View
export type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};
