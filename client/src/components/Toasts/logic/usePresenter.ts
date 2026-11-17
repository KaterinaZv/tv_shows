import { useStore } from '@/shared/hooks/useStore';
import { toastsStore } from '@/stores/toastsStore';

export const usePresenter = () => ({
  toasts: useStore(toastsStore),
});
