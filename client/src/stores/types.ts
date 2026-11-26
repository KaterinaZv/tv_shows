import type { ToastVariant } from '@/shared/types/toasts';

export type Store<T> = {
  get: () => T;
  set: (value: T) => void;
  // For React only: useStore re-renders the component when the value changes
  subscribe: (listener: () => void) => () => void;
};

export type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};
