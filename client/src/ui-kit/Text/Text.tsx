import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Text = (props: Props) => {
  const { children, Tag, className, role } = usePresenter(props);

  return (
    <Tag className={className} role={role}>
      {children}
    </Tag>
  );
};
