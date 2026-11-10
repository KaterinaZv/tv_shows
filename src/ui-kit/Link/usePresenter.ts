import styles from './Link.module.css';
import type { Props } from './types';

export const usePresenter = ({ children, href, isExternal = false, className }: Props) => ({
  children,
  href,
  target: isExternal ? '_blank' : undefined,
  rel: isExternal ? 'noreferrer' : undefined,
  className: [styles.link, className].filter(Boolean).join(' '),
});
