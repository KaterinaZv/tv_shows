import { Chip } from '@/ui-kit/Chip/Chip';

import styles from './LanguageSwitcher.module.css';
import { usePresenter } from './usePresenter';

export const LanguageSwitcher = () => {
  const { groupLabel, options, handleSelect } = usePresenter();

  return (
    <div className={styles.switcher} role="group" aria-label={groupLabel}>
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          value={option.value}
          isActive={option.isActive}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};
