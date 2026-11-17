import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Toast = (props: Props) => {
  const { message, role, icon, className } = usePresenter(props);

  return (
    <div className={className} role={role}>
      <span aria-hidden="true">{icon}</span>
      <span>{message}</span>
    </div>
  );
};
