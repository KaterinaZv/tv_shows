import { AppHeader } from '@/components/AppHeader/AppHeader';
import { Toasts } from '@/components/Toasts/Toasts';
import { ShowsExplorer } from '@/pages/ShowsExplorer/ShowsExplorer';

export const App = () => (
  <>
    <AppHeader />
    <ShowsExplorer />
    <Toasts />
  </>
);
