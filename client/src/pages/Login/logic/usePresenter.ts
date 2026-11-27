import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { isBadRequestError } from '@/api/utils';
import { ROUTES } from '@/shared/constants/routes';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { showToast } from '@/tasks/showToast';

import { isValidEmail } from '../utils';
import { useLogin } from './useLogin';

export const usePresenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  // The hint appears only after an attempt to submit, not while the user is still typing
  const [isHintVisible, setIsHintVisible] = useState(false);
  const { isAuthenticated } = useCurrentUser();
  const { mutate, isPending, error } = useLogin();
  const trimmedEmail = email.trim();
  const isEmailValid = isValidEmail(trimmedEmail);

  // A logged-in user has nothing to do here
  useEffect(() => {
    if (isAuthenticated) void navigate(ROUTES.home, { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = () => {
    if (isPending) return;

    if (!isEmailValid) {
      setIsHintVisible(trimmedEmail.length > 0);

      return;
    }

    mutate(trimmedEmail, {
      onSuccess: (user) => showToast(t('auth.welcome', { email: user.email })),
    });
  };

  return {
    title: t('auth.title'),
    subtitle: t('auth.subtitle'),
    email,
    emailLabel: t('auth.emailLabel'),
    emailPlaceholder: t('auth.emailPlaceholder'),
    submitLabel: t(isPending ? 'auth.submitting' : 'auth.submit'),
    backLabel: t('auth.back'),
    // Disabled until the email looks valid: an obviously wrong one never reaches the server
    isSubmitDisabled: isPending || !isEmailValid,
    errorText: isHintVisible || isBadRequestError(error) ? t('auth.invalidEmail') : error ? t('auth.error') : null,
    handleEmailChange: (value: string) => {
      setEmail(value);
      setIsHintVisible(false);
    },
    handleKeyDown: (key: string) => {
      if (key === 'Enter') handleSubmit();
    },
    handleSubmit,
    handleBack: () => void navigate(ROUTES.home),
  };
};
