import { Button } from '@/ui-kit/Button/Button';

import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

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
