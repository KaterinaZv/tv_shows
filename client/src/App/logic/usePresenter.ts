import { useRoutes } from 'react-router';

import { APP_ROUTES } from '../constants';

// Router: picks the page for the current URL; the header and toasts stay on every page
export const usePresenter = () => ({
  page: useRoutes(APP_ROUTES),
});
