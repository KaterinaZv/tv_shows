import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Button = (props: Props) => {
  const { children, ariaLabel, ariaCurrent, isPressed, isDisabled, className, handleClick } = usePresenter(props);

  return (
    <button
      type="button"
      className={className}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      aria-pressed={isPressed}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
