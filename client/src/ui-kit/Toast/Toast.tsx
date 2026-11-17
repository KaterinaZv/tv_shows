import { Button } from '../Button/Button';
import { usePresenter } from './logic/usePresenter';
import styles from './Toast.module.css';
import type { Props } from './types';

export const Toast = (props: Props) => {
  const { message, closeLabel, role, icon, className, handleClose } = usePresenter(props);

  return (
    <div className={className} role={role}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.message}>{message}</span>
      <Button variant="ghost" className={styles.close} ariaLabel={closeLabel} onClick={handleClose}>
        ✕
      </Button>
    </div>
  );
};
