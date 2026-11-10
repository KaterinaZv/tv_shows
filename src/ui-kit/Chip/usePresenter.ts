import styles from './Chip.module.css';
import type { Props } from './types';

export const usePresenter = ({ label, value, isActive, onSelect }: Props) => ({
  label,
  isActive,
  className: isActive ? `${styles.chip} ${styles.active}` : styles.chip,
  handleClick: () => onSelect(value),
});
