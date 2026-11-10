import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const Heading = (props: Props) => {
  const { children, Tag, className } = usePresenter(props);

  return <Tag className={className}>{children}</Tag>;
};
