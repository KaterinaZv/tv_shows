import { Toast } from '@/ui-kit/Toast/Toast';

import { usePresenter } from './logic/usePresenter';
import styles from './Toasts.module.css';

export const Toasts = () => {
  const { toasts, closeLabel, handleClose } = usePresenter();

  return (
    <div className={styles.viewport}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          closeLabel={closeLabel}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};
