import { Button } from '@/ui-kit/Button/Button';

import { PageButton } from './PageButton/PageButton';
import styles from './Pagination.module.css';
import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const Pagination = (props: Props) => {
  const {
    ariaLabel,
    prevLabel,
    nextLabel,
    pages,
    isPrevDisabled,
    isNextDisabled,
    handlePrev,
    handleNext,
    handlePageSelect,
  } = usePresenter(props);

  return (
    <nav className={styles.pagination} aria-label={ariaLabel}>
      <Button variant="ghost" ariaLabel={prevLabel} isDisabled={isPrevDisabled} onClick={handlePrev}>
        ←
      </Button>
      {pages.map((page) => (
        <PageButton
          key={page.number}
          number={page.number}
          ariaLabel={page.ariaLabel}
          isCurrent={page.isCurrent}
          onSelect={handlePageSelect}
        />
      ))}
      <Button variant="ghost" ariaLabel={nextLabel} isDisabled={isNextDisabled} onClick={handleNext}>
        →
      </Button>
    </nav>
  );
};
