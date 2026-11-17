import { Text } from '@/ui-kit/Text/Text';

import { usePresenter } from './logic/usePresenter';
import styles from './ShowListSkeleton.module.css';

export const ShowListSkeleton = () => {
  const { ariaLabel, wakingUpHint, cards } = usePresenter();

  return (
    <div className={styles.skeleton}>
      <Text variant="caption" className={styles.hint}>
        {wakingUpHint}
      </Text>
      <ul className={styles.list} aria-busy="true" aria-label={ariaLabel}>
        {cards.map((card) => (
          <li key={card.id} className={styles.card}>
            <div className={styles.poster} />
            <div className={styles.body}>
              <div className={styles.line} />
              <div className={styles.shortLine} />
              <div className={styles.line} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
