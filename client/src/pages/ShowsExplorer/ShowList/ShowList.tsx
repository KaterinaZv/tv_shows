import { ShowCard } from './ShowCard/ShowCard';
import styles from './ShowList.module.css';
import type { Props } from './types';

export const ShowList = ({ shows }: Props) => (
  <ul className={styles.list}>
    {shows.map((show) => (
      <li key={show.id} className={styles.item}>
        <ShowCard show={show} />
      </li>
    ))}
  </ul>
);
