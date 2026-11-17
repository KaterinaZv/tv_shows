import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Heading = (props: Props) => {
  const { children, Tag, className } = usePresenter(props);

  return <Tag className={className}>{children}</Tag>;
};
