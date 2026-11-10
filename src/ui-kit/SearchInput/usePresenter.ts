import type { Props } from './types';

export const usePresenter = ({
  value,
  placeholder,
  ariaLabel,
  clearLabel,
  loadingLabel,
  isLoading,
  onChange,
}: Props) => ({
  value,
  placeholder,
  ariaLabel,
  clearLabel,
  loadingLabel,
  isLoading,
  hasValue: value.length > 0,
  handleChange: onChange,
  handleKeyDown: (key: string) => {
    if (key === 'Escape') {
      onChange('');
    }
  },
  handleClear: () => onChange(''),
});
