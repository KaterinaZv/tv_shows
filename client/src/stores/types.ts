export type Store<T> = {
  get: () => T;
  set: (value: T) => void;
  // For React only: useStore re-renders the component when the value changes
  subscribe: (listener: () => void) => () => void;
};

export type ToastVariant = 'success' | 'error';

export type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};
