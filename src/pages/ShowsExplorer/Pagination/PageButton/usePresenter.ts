import styles from './PageButton.module.css';
import type { Props } from './types';

export const usePresenter = ({ number, ariaLabel, isCurrent, onSelect }: Props) => ({
  label: String(number),
  ariaLabel,
  ariaCurrent: isCurrent ? ('page' as const) : undefined,
  variant: isCurrent ? ('primary' as const) : ('secondary' as const),
  className: styles.button,
  handleClick: () => onSelect(number),
});
