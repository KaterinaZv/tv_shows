import { ShowCard } from '@/components/ShowCard/ShowCard';
import { Badge } from '@/ui-kit/Badge/Badge';
import { Button } from '@/ui-kit/Button/Button';
import { Drawer } from '@/ui-kit/Drawer/Drawer';
import { Spinner } from '@/ui-kit/Spinner/Spinner';
import { Text } from '@/ui-kit/Text/Text';

import styles from './Favorites.module.css';
import { usePresenter } from './logic/usePresenter';

export const Favorites = () => {
  const {
    isOpen,
    count,
    buttonIcon,
    buttonLabel,
    buttonAriaLabel,
    drawerTitle,
    closeLabel,
    loadingLabel,
    shows,
    isLoading,
    isEmpty,
    emptyText,
    isError,
    errorText,
    handleOpen,
    handleClose,
  } = usePresenter();

  return (
    <>
      <Button ariaLabel={buttonAriaLabel} onClick={handleOpen}>
        <Text as="span" className={styles.star}>
          {buttonIcon}
        </Text>
        <Text as="span" className={styles.label}>
          {buttonLabel}
        </Text>
        <Badge>{count}</Badge>
      </Button>

      <Drawer isOpen={isOpen} title={drawerTitle} closeLabel={closeLabel} onClose={handleClose}>
        {isLoading ? <Spinner label={loadingLabel} /> : null}
        {isEmpty ? <Text variant="muted">{emptyText}</Text> : null}
        {isError ? <Text variant="muted">{errorText}</Text> : null}
        <ul className={styles.list}>
          {shows.map((show) => (
            <li key={show.id} className={styles.item}>
              <ShowCard show={show} />
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
};
