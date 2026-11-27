import { AppHeader } from '@/components/AppHeader/AppHeader';
import { Toasts } from '@/components/Toasts/Toasts';

import { usePresenter } from './logic/usePresenter';

export const App = () => {
  const { page } = usePresenter();

  return (
    <>
      <AppHeader />
      {page}
      <Toasts />
    </>
  );
};
