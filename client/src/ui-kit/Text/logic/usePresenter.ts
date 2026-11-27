import styles from '../Text.module.css';
import type { Props } from '../types';

export const usePresenter = ({ children, as = 'p', variant = 'body', className, role }: Props) => ({
  children,
  role,
  Tag: as,
  className: [styles.text, styles[variant], className].filter(Boolean).join(' '),
});
