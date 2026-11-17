import type { Store } from './types';

// A store is a "database": it only holds a value. All logic of changing it lives in tasks
export const createStore = <T>(initialValue: T): Store<T> => {
  let value = initialValue;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (nextValue) => {
      value = nextValue;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => listeners.delete(listener);
    },
  };
};
