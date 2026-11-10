import styles from './Badge.module.css';
import type { Props } from './types';

export const usePresenter = ({ children, variant = 'accent', className }: Props) => ({
  children,
  className: [styles.badge, styles[variant], className].filter(Boolean).join(' '),
});
