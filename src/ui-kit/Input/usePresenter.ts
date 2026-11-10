import type { ChangeEvent, KeyboardEvent } from 'react';

import styles from './Input.module.css';
import type { Props } from './types';

export const usePresenter = ({
  value,
  ariaLabel,
  onChange,
  onKeyDown,
  placeholder,
  type = 'text',
  variant = 'default',
}: Props) => ({
  value,
  ariaLabel,
  placeholder,
  type,
  className: `${styles.input} ${styles[variant]}`,
  handleChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => onKeyDown?.(event.key),
});
