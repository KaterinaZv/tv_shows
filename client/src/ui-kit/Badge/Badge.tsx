import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Badge = (props: Props) => {
  const { children, className } = usePresenter(props);

  return <span className={className}>{children}</span>;
};
