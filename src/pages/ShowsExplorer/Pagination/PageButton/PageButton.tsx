import { Button } from '@/ui-kit/Button/Button';

import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const PageButton = (props: Props) => {
  const { label, ariaLabel, ariaCurrent, variant, className, handleClick } = usePresenter(props);

  return (
    <Button
      variant={variant}
      ariaLabel={ariaLabel}
      ariaCurrent={ariaCurrent}
      className={className}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};
