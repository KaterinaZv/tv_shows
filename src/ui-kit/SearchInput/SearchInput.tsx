import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Spinner } from '../Spinner/Spinner';
import styles from './SearchInput.module.css';
import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const SearchInput = (props: Props) => {
  const {
    value,
    placeholder,
    ariaLabel,
    clearLabel,
    loadingLabel,
    isLoading,
    hasValue,
    handleChange,
    handleKeyDown,
    handleClear,
  } = usePresenter(props);

  return (
    <div className={styles.field}>
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <Input
        variant="bare"
        type="search"
        value={value}
        placeholder={placeholder}
        ariaLabel={ariaLabel}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {isLoading ? <Spinner label={loadingLabel} /> : null}
      {hasValue ? (
        <Button variant="ghost" ariaLabel={clearLabel} onClick={handleClear}>
          ✕
        </Button>
      ) : null}
    </div>
  );
};
