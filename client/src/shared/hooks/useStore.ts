import { useSyncExternalStore } from 'react';

import type { Store } from '@/stores/types';

// Subscribes a component to a store: the presenter reads data, changes go through tasks
export const useStore = <T>(store: Store<T>) => useSyncExternalStore(store.subscribe, store.get);
