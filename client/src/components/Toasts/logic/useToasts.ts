import { useStore } from '@/shared/hooks/useStore';
import { toastsStore } from '@/stores/toastsStore';

import type { ToastItem } from '../types';

// The only place that knows toastsStore: maps store records to the View's own type,
// so the presenter and the View do not depend on how the store is shaped
export const useToasts = (): ToastItem[] =>
  useStore(toastsStore).map(({ id, message, variant }) => ({ id, message, variant }));
