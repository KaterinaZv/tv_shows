import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';

import styles from './AppHeader.module.css';
import { Favorites } from './Favorites/Favorites';
import { usePresenter } from './logic/usePresenter';
import { UserMenu } from './UserMenu/UserMenu';

export const AppHeader = () => {
  const { hasFavorites } = usePresenter();

  return (
    <header className={styles.header}>
      {hasFavorites ? <Favorites /> : null}
      <UserMenu />
      <LanguageSwitcher />
    </header>
  );
};
