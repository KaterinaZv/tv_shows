import { Button } from '@/ui-kit/Button/Button';
import { Text } from '@/ui-kit/Text/Text';

import { usePresenter } from './logic/usePresenter';
import styles from './UserMenu.module.css';

export const UserMenu = () => {
  const { isLoggedIn, isGuest, email, loginLabel, logoutLabel, isLoggingOut, handleLogin, handleLogout } =
    usePresenter();

  return (
    <>
      {isLoggedIn ? (
        <div className={styles.menu}>
          <Text as="span" variant="caption" className={styles.email}>
            {email}
          </Text>
          <Button isDisabled={isLoggingOut} onClick={handleLogout}>
            {logoutLabel}
          </Button>
        </div>
      ) : null}
      {isGuest ? (
        <Button variant="primary" onClick={handleLogin}>
          {loginLabel}
        </Button>
      ) : null}
    </>
  );
};
