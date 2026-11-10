import { SearchInput } from '@/ui-kit/SearchInput/SearchInput';

import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const SearchBar = (props: Props) => {
  const { value, isLoading, placeholder, ariaLabel, clearLabel, loadingLabel, handleChange } = usePresenter(props);

  return (
    <SearchInput
      value={value}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      clearLabel={clearLabel}
      loadingLabel={loadingLabel}
      isLoading={isLoading}
      onChange={handleChange}
    />
  );
};
