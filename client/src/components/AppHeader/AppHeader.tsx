import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';

import styles from './AppHeader.module.css';

export const AppHeader = () => (
  <header className={styles.header}>
    <LanguageSwitcher />
  </header>
);
