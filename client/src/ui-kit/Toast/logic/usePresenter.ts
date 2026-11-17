import styles from '../Toast.module.css';
import type { Props } from '../types';

export const usePresenter = ({ message, variant }: Props) => ({
  message,
  // Errors interrupt the screen reader, success messages wait politely
  role: variant === 'error' ? ('alert' as const) : ('status' as const),
  icon: variant === 'error' ? '⚠️' : '★',
  className: `${styles.toast} ${styles[variant]}`,
});
