import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Input = (props: Props) => {
  const { value, ariaLabel, placeholder, type, className, handleChange, handleKeyDown } = usePresenter(props);

  return (
    <input
      className={className}
      type={type}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoComplete="off"
      spellCheck={false}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};
