import styles from './Spinner.module.css';
import type { Props } from './types';

export const Spinner = ({ label }: Props) => <span className={styles.spinner} role="status" aria-label={label} />;
