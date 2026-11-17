import styles from '../Toast.module.css';
import type { Props } from '../types';

export const usePresenter = ({ id, message, variant, closeLabel, onClose }: Props) => ({
  message,
  closeLabel,
  // Errors interrupt the screen reader, success messages wait politely
  role: variant === 'error' ? ('alert' as const) : ('status' as const),
  icon: variant === 'error' ? '⚠️' : '★',
  className: `${styles.toast} ${styles[variant]}`,
  handleClose: () => onClose(id),
});
