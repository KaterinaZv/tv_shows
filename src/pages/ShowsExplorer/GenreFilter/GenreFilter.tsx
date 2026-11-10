import { Chip } from '@/ui-kit/Chip/Chip';

import styles from './GenreFilter.module.css';
import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const GenreFilter = (props: Props) => {
  const { hasGenres, groupLabel, chips, handleSelect } = usePresenter(props);

  return hasGenres ? (
    <div className={styles.filter} role="group" aria-label={groupLabel}>
      {chips.map((chip) => (
        <Chip key={chip.value} label={chip.label} value={chip.value} isActive={chip.isActive} onSelect={handleSelect} />
      ))}
    </div>
  ) : null;
};
