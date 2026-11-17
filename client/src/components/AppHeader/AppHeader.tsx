import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';

import styles from './AppHeader.module.css';
import { Favorites } from './Favorites/Favorites';

export const AppHeader = () => (
  <header className={styles.header}>
    <Favorites />
    <LanguageSwitcher />
  </header>
);
