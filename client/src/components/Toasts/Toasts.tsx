import { Toast } from '@/ui-kit/Toast/Toast';

import { usePresenter } from './logic/usePresenter';
import styles from './Toasts.module.css';

export const Toasts = () => {
  const { toasts } = usePresenter();

  return (
    <div className={styles.viewport}>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} />
      ))}
    </div>
  );
};
