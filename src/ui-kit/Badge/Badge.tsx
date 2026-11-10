import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const Badge = (props: Props) => {
  const { children, className } = usePresenter(props);

  return <span className={className}>{children}</span>;
};
