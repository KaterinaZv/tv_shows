import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Text = (props: Props) => {
  const { children, Tag, className } = usePresenter(props);

  return <Tag className={className}>{children}</Tag>;
};
