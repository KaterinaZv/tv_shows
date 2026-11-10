import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const Link = (props: Props) => {
  const { children, href, target, rel, className } = usePresenter(props);

  return (
    <a className={className} href={href} target={target} rel={rel}>
      {children}
    </a>
  );
};
