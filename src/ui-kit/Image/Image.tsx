import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const Image = (props: Props) => {
  const { src, alt, loading, className } = usePresenter(props);

  return <img className={className} src={src} alt={alt} loading={loading} />;
};
