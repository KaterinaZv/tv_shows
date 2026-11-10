import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const Button = (props: Props) => {
  const { children, ariaLabel, ariaCurrent, isDisabled, className, handleClick } = usePresenter(props);

  return (
    <button
      type="button"
      className={className}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
