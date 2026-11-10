import styles from './Image.module.css';
import type { Props } from './types';

export const usePresenter = ({ src, alt, isLazy = true, className }: Props) => ({
  src,
  alt,
  loading: isLazy ? ('lazy' as const) : ('eager' as const),
  className: [styles.image, className].filter(Boolean).join(' '),
});
