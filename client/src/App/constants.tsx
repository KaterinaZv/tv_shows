import type { RouteObject } from 'react-router';
import { Navigate } from 'react-router';

import { Login } from '@/pages/Login/Login';
import { ShowsExplorer } from '@/pages/ShowsExplorer/ShowsExplorer';
import { ROUTES } from '@/shared/constants/routes';

export const APP_ROUTES: RouteObject[] = [
  { path: ROUTES.home, element: <ShowsExplorer /> },
  { path: ROUTES.login, element: <Login /> },
  { path: '*', element: <Navigate to={ROUTES.home} replace /> },
];
