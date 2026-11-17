import styles from '../Button.module.css';
import type { Props } from '../types';

export const usePresenter = ({
  children,
  onClick,
  variant = 'secondary',
  isDisabled = false,
  ariaLabel,
  ariaCurrent,
  isPressed,
  className,
}: Props) => ({
  children,
  ariaLabel,
  ariaCurrent,
  isPressed,
  isDisabled,
  className: [styles.button, styles[variant], className].filter(Boolean).join(' '),
  handleClick: onClick,
});
