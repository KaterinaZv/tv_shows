import { toastsStore } from '@/stores/toastsStore';

export const dismissToast = (id: number) => {
  toastsStore.set(toastsStore.get().filter((toast) => toast.id !== id));
};
