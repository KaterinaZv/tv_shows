import { Button } from '@/ui-kit/Button/Button';
import { Heading } from '@/ui-kit/Heading/Heading';
import { Text } from '@/ui-kit/Text/Text';

import styles from './SearchStatus.module.css';
import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const SearchStatus = (props: Props) => {
  const { icon, title, text, hasRetry, retryLabel, handleRetry } = usePresenter(props);

  return (
    <div className={styles.status}>
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      <Heading level={2}>{title}</Heading>
      <Text variant="muted" className={styles.text}>
        {text}
      </Text>
      {hasRetry ? (
        <Button variant="primary" onClick={handleRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
};
