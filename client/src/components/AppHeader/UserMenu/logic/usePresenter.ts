import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { ROUTES } from '@/shared/constants/routes';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { showToast } from '@/tasks/showToast';

import { useLogout } from './useLogout';

export const usePresenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isPending } = useCurrentUser();
  const { mutate, isPending: isLoggingOut } = useLogout();

  return {
    // While the session is being checked, show neither the email nor the login button
    isLoggedIn: Boolean(user),
    // The login page has its own form: the header button would only duplicate it
    isGuest: !isPending && !user && pathname !== ROUTES.login,
    email: user?.email ?? '',
    loginLabel: t('auth.login'),
    logoutLabel: t('auth.logout'),
    isLoggingOut,
    handleLogin: () => void navigate(ROUTES.login),
    handleLogout: () => mutate(undefined, { onSettled: () => showToast(t('auth.loggedOut')) }),
  };
};
