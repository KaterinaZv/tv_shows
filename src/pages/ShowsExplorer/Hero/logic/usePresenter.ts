import { useTranslation } from 'react-i18next';

export const usePresenter = () => {
  const { t } = useTranslation();

  return {
    badge: t('header.badge'),
    title: t('header.title'),
    subtitle: t('header.subtitle'),
  };
};
