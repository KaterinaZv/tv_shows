import { usePresenter } from './logic/usePresenter';
import styles from './ShowListSkeleton.module.css';

export const ShowListSkeleton = () => {
  const { ariaLabel, cards } = usePresenter();

  return (
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
  );
};
