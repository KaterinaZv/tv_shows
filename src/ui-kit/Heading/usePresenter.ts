import { HEADING_TAGS } from './constants';
import styles from './Heading.module.css';
import type { Props } from './types';

export const usePresenter = ({ children, level, className }: Props) => ({
  children,
  Tag: HEADING_TAGS[level],
  className: [styles.heading, styles[`level${level}`], className].filter(Boolean).join(' '),
});
