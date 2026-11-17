import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Chip = (props: Props) => {
  const { label, isActive, className, handleClick } = usePresenter(props);

  return (
    <button type="button" className={className} aria-pressed={isActive} onClick={handleClick}>
      {label}
    </button>
  );
};
