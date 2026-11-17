import { createStore } from './createStore';
import type { Toast } from './types';

export const toastsStore = createStore<Toast[]>([]);
